---
title: pyserial 的 read(N) 会把你的轮询钉死在超时上
summary: 多设备串口轮询延迟怎么都降不下来，最后发现是一行 read(512) 在老老实实等超时。
date: 2026-03-18
tags: [Python, 串口, 调试]
---

## 现象

上位机轮询多台传感器，每台一问一答。单台时往返时间（RTT）约 5 ms，正常；接到四台之后，每台的 RTT 都稳稳地变成 **50 ms**，不多不少。

“稳稳地”是关键线索。网络抖动、设备变慢，都不会给出一个如此整齐的数字。50 ms 是什么？是我给串口设的 `timeout=0.05`。

## 原因

`pyserial` 的 `Serial.read(size)` 的语义是：**读到 `size` 个字节，或者等到超时，二者取先到者。** 我的读取代码是这样的：

```python
ser = serial.Serial(port, 921600, timeout=0.05)
...
data = ser.read(512)   # 想着"一次多读点"
```

设备一次只回 76 字节。`read(512)` 收到 76 字节后并不会返回——它还在等剩下的 436 字节，一直等到 50 ms 超时才把手里那 76 字节交出来。单台时无所谓（反正下一个包也要等），多台轮询时，每一台都要白白吃掉一个完整超时。

## 修法

按帧长读，不多不少：

```python
FRAME_LEN = 76

def read_frame(ser):
    head = ser.read(1)            # 等帧头
    if not head:
        return None
    rest = ser.read(FRAME_LEN - 1)
    if len(rest) != FRAME_LEN - 1:
        return None               # 超时/半帧，交给上层重同步
    return head + rest
```

如果帧长可变，用 `ser.in_waiting` 先看缓冲区里有多少，再读那么多；或者用 `read_until()` 配合帧尾。

改完之后四台并行 RTT 回到 5–6 ms。

## 顺手记一条

同一批代码里还有个 `time.perf_counter()` 的坑：Windows 上它是**进程相对**的，主进程和采集子进程各自的零点不同，跨进程比较时戳会差出几秒到几分钟。解决方法是用 `ctypes` 直接读 `QueryPerformanceCounter`，再用主进程启动时记下的偏移换算。这个单独写了一篇。
