---
title: pyserial's read(N) Will Pin Your Polling Loop to the Timeout
summary: Multi-device serial polling latency would not come down, until I found a single read(512) dutifully waiting for its timeout.
date: 2026-03-18
tags: [Python, Serial, Debugging]
---

## Symptom

The host polls several sensors, one request–reply per device. With one device the round-trip time (RTT) is about 5 ms — fine. With four devices attached, every RTT becomes **exactly 50 ms**, no more, no less.

"Exactly" is the clue. Network jitter or a slow device never gives you such a neat number. What is 50 ms? It's the `timeout=0.05` I had configured on the serial port.

## Cause

The semantics of `pyserial`'s `Serial.read(size)` are: **return after reading `size` bytes, or after the timeout, whichever comes first.** My code looked like this:

```python
ser = serial.Serial(port, 921600, timeout=0.05)
...
data = ser.read(512)   # "read a bit more at once", I thought
```

A device replies with 76 bytes per frame. `read(512)` receives those 76 bytes and does *not* return — it keeps waiting for the remaining 436 bytes until the 50 ms timeout expires, then hands over the 76 it has. With one device this doesn't matter (you'd wait for the next frame anyway); with four devices in a polling loop, every single one burns a full timeout for nothing.

## Fix

Read exactly one frame:

```python
FRAME_LEN = 76

def read_frame(ser):
    head = ser.read(1)            # wait for frame header
    if not head:
        return None
    rest = ser.read(FRAME_LEN - 1)
    if len(rest) != FRAME_LEN - 1:
        return None               # timeout / partial frame, let caller resync
    return head + rest
```

If frames are variable-length, check `ser.in_waiting` first and read that many bytes, or use `read_until()` with a frame terminator.

After the change, four devices in parallel are back to 5–6 ms RTT.

## A related note

The same codebase had another trap: on Windows, `time.perf_counter()` is **process-relative** — the main process and the acquisition subprocess each have their own zero, so comparing timestamps across processes is off by seconds to minutes. The fix is to read `QueryPerformanceCounter` directly via `ctypes` and convert with an offset captured at main-process start. That one got its own post.
