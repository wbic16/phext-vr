# Sample corpus provenance

`incipit-excerpt.phext` — 32 scrolls excerpted from **Incipit**
(`incipit.phext` in [wbic16/human](https://github.com/wbic16/human), Will
Bickford's public phext corpus).

- Source file SHA-256: `f640f6034322c9698a095741c520e925d613aada80b962a16d507e35e6d27ff9`
- Excerpt SHA-256: `d35a323611f484428d487924a7349932df420a59443c1d13b718473b930c5944`
- Selection: the home volume `1.1.1/1.1.1/*` (20 scrolls), `1.1.1/2.1.1/*` (3),
  `1.1.1/9.9.9/*` (2), `1.1.1/10.10.10/*` (5), the V16 priming scroll at
  `23.6.9/7.6.9/6.6.8`, and the Ten Commandments scroll at
  `1000.1.1/1.1.1/1.1.1` — chosen to spread across the coordinate space so
  both projections have something to show.
- The excerpt was cut with the reference parser itself
  (libphext-node v0.6.1: `explode` → select → `implode`), and round-trip
  verified: re-parsing the excerpt reproduces the selected scroll map
  byte-for-byte.
- Scroll texts are unmodified from the source.
