---
title: Windows 上 time.perf_counter() 是进程相对的
summary: 主进程和子进程各自从零开始计时，跨进程对齐时戳必须直读 QPC。
date: 2026-03-25
tags: [Python, Windows, 多进程, 时戳]
---

## 问题

采集程序用 `multiprocessing` 起了一个子进程专门收串口数据，每一帧打上 `time.perf_counter()` 时戳，主进程再把多台设备的数据按时戳对齐。结果对齐出来的曲线整体偏移了几十秒，而且每次运行偏移量都不一样。

## 原因

Python 文档对 `perf_counter()` 的说法是“返回值的参考点未定义，只有两次调用之差有意义”。在 Windows 上，CPython 的实现是 `QueryPerformanceCounter()` **减去进程启动时的读数**——也就是说，每个进程的 `perf_counter()` 都从自己启动的那一刻算零点。

主进程先启动，子进程晚了几十秒（`spawn` 模式下要重新导入 numpy、scipy，冷启动确实慢），两边的零点就差了这几十秒。单进程内完全正确，跨进程一比就错。

Linux 上 `perf_counter()` 用的是 `CLOCK_MONOTONIC`，系统级单调时钟，不存在这个问题——这也是为什么在别的机器上从没遇到过。

## 修法

跨进程要用一个所有进程共享参考点的时钟。Windows 上最直接的就是绕过 Python 的封装，直接读 QPC：

```python
import ctypes, ctypes.wintypes

_qpc = ctypes.windll.kernel32.QueryPerformanceCounter
_qpf = ctypes.windll.kernel32.QueryPerformanceFrequency
_freq = ctypes.c_int64()
_qpf(ctypes.byref(_freq))
FREQ = _freq.value

def qpc_seconds() -> float:
    """系统级单调时钟（秒），所有进程共用同一零点"""
    c = ctypes.c_int64()
    _qpc(ctypes.byref(c))
    return c.value / FREQ
```

如果历史数据已经用 `perf_counter()` 打好了时戳，可以在主进程启动时同时记录一次 `perf_counter()` 和 `qpc_seconds()`，两者之差就是主进程零点在 QPC 上的位置，用它把子进程时戳换算回来。

## 经验

- 凡是**跨进程**比较时间，先确认时钟的参考点是不是系统级的
- Windows 上 `time.monotonic()` 底层是 `GetTickCount64`，参考点是系统级的，但分辨率只有 ~15.6 ms，对 500 Hz 数据来说太粗
- `time.time()` 同样是系统级、同样只有 ~15.6 ms 分辨率，并且还会被 NTP 校时拽来拽去，更不适合
