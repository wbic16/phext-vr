# phext-vr

Use phext to orient text in AR/VR — layer text into 3D scenes: tile a scene
with a phext corpus organically, slide scrolls to where they belong, and let
bespoke projection algorithms carry the corpus from 9D coordinates into 3D
space on demand.

**Stage 1** ships a WebXR-capable viewer:

- Loads a real phext (a 32-scroll excerpt of Incipit ships in `sample/`;
  load any `.phext` file of your own) and parses it with the reference
  implementation — **libphext-node v0.6.1**, vendored, never hand-rolled.
- Renders every scroll as a readable text panel under a **projection**:
  *Lattice Room* (the corpus as a 3D grid tiling a room) or *Scroll Shell*
  (concentric spheres) — switchable live; projections are pluggable pure
  functions of the 9D coordinate.
- **Slide any scroll** to a new pose (drag; Alt+drag to turn). The pose is
  written to a **mapping layer outside the phext** — persisted in the
  browser, exportable/importable as JSON, overlapping freely, resettable to
  the pure projection. The phext itself is never mutated by layout.
- Scrolls are unbounded pages: text wraps and pages *inside the panel*;
  the model is never truncated.
- Dark scene by default following your OS preference, with a persisted
  toggle; Metallic Golden Phext accents, flat by rule.
- Enters immersive VR where WebXR is available; controllers grab and slide
  scrolls through the same mapping path.

## Run it

It's static — host the directory anywhere, or locally:

```sh
python3 -m http.server 8000
# open http://localhost:8000/
```

(A local server, not `file://`, so the sample corpus can be fetched.)

## Layout

| Path | What |
| --- | --- |
| `index.html` | the page + HUD |
| `src/app.js` | scene, interaction, XR controllers |
| `src/projections.js` | the projection algorithms (add your own here) |
| `src/mapping.js` | the mapping layer: persistence, export/import, reset |
| `src/panel.js` | scroll text layout (wrap + page) and panel rendering |
| `vendor/libphext.js` | the reference parser, libphext-node v0.6.1 (see `vendor/UPSTREAM.md`) |
| `vendor/three/` | three.js r160, vendored for self-containment |
| `sample/` | a real excerpt corpus from Incipit, with provenance |
| `tests/` | parser conformance test against a foreign-written fixture |
| `DESIGN.md` | the model: projection, mapping layer, infinite scroll space |

## Verify

```sh
node tests/conformance.mjs   # vendored parser vs a fixture written by the Python port
```

## Open legs

On-device VR verification (no headset in the build environment — the
desktop path is the verified one), texture atlasing for very large corpora,
and in-scene text editing. See `DESIGN.md`.
