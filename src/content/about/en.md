I'm 7yewh, an embedded hardware and sensor-algorithm engineer.

What I do fits in one sentence: **turn the weak, noisy signals of the physical world into data that the layers above can trust.** That chain is long — analog front-ends, acquisition and demodulation firmware on the MCU, communication protocols and OTA, host-side visualisation and analysis, and finally squeezing algorithms (neural networks included) into a few dozen kilobytes of on-chip resources. I like to own the whole chain, because the bugs usually live in the seams between layers.

## What I care about

- **Reliability over flash.** Firmware that streams steadily for years without a reset is worth far more than one that occasionally posts an impressive number.
- **Let the data speak.** When something "feels wrong", record it and plot it before concluding anything. Many an "algorithm bug" turned out to be a loose mechanical part, a colliding COM port, or a `read()` waiting for its timeout.
- **Write it down.** Every pitfall deserves a reproducible write-up — which is why this site has a blog.

## Contact

Code and open-source work live on [GitHub](https://github.com/7yewh).
