# phext-vr — design

*Layer text into 3D scenes for VR: tile a scene with phext, organically.*

## The model

A **phext** is a corpus of **scrolls**, each addressed by a 9D coordinate
(`library.shelf.series / collection.volume.book / chapter.section.scroll`).
A scroll is a 2D page of plain text — lines and columns are free dimensions
inside the scroll; the scroll itself is unbounded ("infinite scroll space").
phext-vr renders that corpus as readable text panels in a 3D scene. It never
edits the phext: layout is a view, and the view is disposable.

All phext parsing goes through the reference implementation —
**libphext-node v0.6.1** (the JavaScript port of libphext-rs), vendored at
`vendor/libphext.js`. There is no hand-rolled parser in this repo, by design
and by house law. See `vendor/UPSTREAM.md` for provenance and the one
build-time substitution (a stub for the Node-only `lzma-native`, reachable
only from the seal/unseal functions the viewer never calls), and
`tests/conformance.mjs` for the foreign-corpus conformance test.

## Projection: 9D → 3D, on demand

A **projection** is a pure function from a scroll's coordinate to a scene
pose, computed on demand from the corpus — nothing about layout is stored in
the phext, and switching projections re-derives every unmoved scroll's pose
live.

```js
project(item, ctx) -> { position: [x, y, z], normal: [x, y, z], scale }
item = { coord, comps: [lb, sf, sr, cn, vm, bk, ch, sn, sc], text }
ctx  = { items, zRank, yRank, xRank, count }  // dense numeric ranks of each
                                              // axis-triple over the corpus
```

Algorithms are pluggable: add a function to `src/projections.js` and it is
selectable. Stage 1 ships two, chosen to be genuinely different mappings of
the same corpus:

- **Lattice Room** — the corpus tiles a room as a 3D grid: scene X ← the
  chapter.section.scroll triple (reading order), scene Y ←
  collection.volume.book (shelf height), scene Z ← library.shelf.series
  (room depth). Panels face the aisle. This is the "tile a scene with phext"
  mapping: a corpus becomes architecture.
- **Scroll Shell** — concentric spheres, one shell per library triple,
  scrolls spread by golden-angle spiral within their shell, faces outward.
  Depth becomes radius; the same corpus becomes an orrery.

Bespoke algorithms are the point: a projection can be any function of the
coordinate (and of corpus statistics via `ctx`) — a wall, a spiral, a city
grid, a brain. The two shipped ones are proofs of the seam, not the ceiling.

## The mapping layer: sliding is an override, not an edit

Sliding a scroll in the scene writes a **mapping override**:

```json
{ "1.1.1/1.1.1/1.1.11": { "p": [x, y, z], "q": [qx, qy, qz, qw], "s": 1.0 } }
```

- Overrides live **outside the phext** (`src/mapping.js`); the phext file is
  never mutated by layout.
- They persist in `localStorage`, keyed by a SHA-256 content hash of the
  corpus (`phext-vr:mapping:v1:<id>`), so each corpus keeps its own
  arrangement — and export/import as a JSON file
  (`phext-vr-mapping/1`) so an arrangement can travel.
- They **overlap freely**. There are no collision rules: any mapping the
  user wants is a valid mapping.
- **Reset** clears all overrides and restores the pure projection.
- A scroll with an override keeps it across projection switches — what you
  placed by hand stays placed; everything else re-projects around it.

## Infinite scroll space

A scroll's text is held whole in the model. The panel is a window: text is
word-wrapped to the panel's width and paged to its height (wheel over a
scroll, PgUp/PgDn, or the HUD page buttons turn its pages; the footer shows
`page i / n`). Placement and wrapping are view concerns; the scroll is never
truncated, and paging never writes anything anywhere.

## Interaction

- **Desktop (slice 1 input):** drag = slide along a camera-facing plane;
  Alt+drag (or right-drag) = turn (yaw + pitch); orbit on empty space.
- **WebXR:** the scene enters immersive VR where available
  (`renderer.xr` + VRButton). Controllers use the same grab/slide/persist
  path: point, squeeze to grab, move, release to set down — the pose lands
  in the same mapping layer. On-device verification is an open leg (below).

## Theme

House rule: dark by default, following the visitor's OS preference; the HUD
theme toggle is an explicit override, persisted. Accents are **Metallic
Golden Phext**, flat by rule (gold leaf, not gold paint — no gradients).

## Stage 1 scope and open legs

Shipped: the viewer, two projections, the mapping layer with
persistence/export/import/reset, the sample corpus, the conformance test,
desktop drag + WebXR entry with controller grab code on the same path.

Open legs, plainly:

- **On-device VR verification** — no headset is reachable from the build
  environment; the desktop orbit path is the verified one, and the WebXR
  session + controller code is exercised only as far as `navigator.xr`
  existing in a headless browser. First headset pass is a human step.
- **Performance on large corpora** — one canvas texture per scroll is
  comfortable at the sample's 32 scrolls and plausible into the low
  hundreds; a full incipit (199 scrolls) or emise-scale corpus wants
  texture atlasing / LOD, unbuilt.
- **Editing text in-scene** — out of scope for stage 1; layout only.
- **Multi-user / shared mappings** — mappings are local files today; a
  hosted mapping registry is a later stage's question.
