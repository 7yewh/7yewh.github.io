---
title: On Windows, time.perf_counter() Is Process-Relative
summary: Parent and child processes each start counting from their own zero; aligning timestamps across processes means reading QPC directly.
date: 2026-03-25
tags: [Python, Windows, Multiprocessing, Timestamps]
---

## Problem

The acquisition tool spawns a `multiprocessing` child dedicated to reading the serial port. Every frame is stamped with `time.perf_counter()`, and the parent aligns data from several devices by timestamp. The aligned curves came out shifted by tens of seconds — and the shift was different on every run.

## Cause

The Python docs say of `perf_counter()`: "the reference point of the returned value is undefined, so that only the difference between the results of two calls is valid." On Windows, CPython implements it as `QueryPerformanceCounter()` **minus the reading taken at process start** — so every process's `perf_counter()` has its own zero, the moment that process started.

The parent starts first; the child comes up tens of seconds later (under `spawn` it re-imports numpy and scipy, and that cold start really is slow). The two zeros differ by exactly that gap. Within one process everything is correct; compare across processes and it's wrong.

On Linux, `perf_counter()` uses `CLOCK_MONOTONIC`, a system-wide monotonic clock, so the problem never appears — which is why I had never seen it on other machines.

## Fix

Cross-process comparisons need a clock whose reference point is shared by all processes. On Windows the most direct option is to bypass Python's wrapper and read QPC yourself:

```python
import ctypes, ctypes.wintypes

_qpc = ctypes.windll.kernel32.QueryPerformanceCounter
_qpf = ctypes.windll.kernel32.QueryPerformanceFrequency
_freq = ctypes.c_int64()
_qpf(ctypes.byref(_freq))
FREQ = _freq.value

def qpc_seconds() -> float:
    """System-wide monotonic clock in seconds, same zero for every process."""
    c = ctypes.c_int64()
    _qpc(ctypes.byref(c))
    return c.value / FREQ
```

If you already have data stamped with `perf_counter()`, record both `perf_counter()` and `qpc_seconds()` once at parent start-up; their difference locates the parent's zero on the QPC axis, and you can convert child timestamps with it.

## Lessons

- Whenever you compare time **across processes**, first confirm the clock's reference point is system-wide
- On Windows `time.monotonic()` is backed by `GetTickCount64` — system-wide, but only ~15.6 ms resolution, far too coarse for 500 Hz data
- `time.time()` is likewise system-wide at ~15.6 ms resolution, and additionally gets yanked around by NTP adjustments — even less suitable
