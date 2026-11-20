# Vendored upstream code

## libphext.js — the reference phext parser

- **What:** libphext-node **v0.6.1** — the JavaScript port of libphext-rs,
  the reference implementation of phext. All phext parsing in phext-vr goes
  through this file. (House law, learned the hard way in qexo, 2026-11-13:
  if it parses phext, it uses the phext parser — never a hand-rolled one.)
- **Source:** https://github.com/wbic16/libphext-node, branch `exo`,
  commit `798159183187e5cdfef66f3673af7439194cf83a`, file `src/index.ts`
  (blob `d71db23bf6a9df6d206a07fb2556d44620843b32`).
- **Build:** bundled with esbuild (`--bundle --format=esm --platform=browser`)
  together with its pure-TypeScript dependencies (`buffer`, `xxh3-ts`).
  The parser source is **unmodified**.
- **One substitution:** the Node-only native module `lzma-native` is aliased
  to a stub that throws if called. In libphext-node v0.6.1, lzma is
  referenced only by `Phext.seal_phext` / `Phext.unseal_phext` (xz
  compression of whole phexts) — no parsing, fetching, or serializing code
  path touches it, and phext-vr never calls seal/unseal. This is a bundling
  substitution for a native dependency, not a change to parser behavior;
  `tests/conformance.mjs` verifies the bundled parser against a fixture
  written by a different implementation (the Python libphext port).
- **License:** MIT (see the license banners inside the bundle).

## three/ — three.js r160

- `three.module.js`, `addons/controls/OrbitControls.js`,
  `addons/webxr/VRButton.js` from the three.js **0.160.0** npm package,
  vendored so the viewer is self-contained and hostable anywhere.
  License: MIT (see file headers).
