// Projections: pure functions from a scroll's 9D coordinate to a scene pose.
//
// A projection is computed ON DEMAND from the corpus — nothing about layout
// is stored in the phext. Algorithms are pluggable: register a function with
// the signature below and it becomes selectable in the viewer.
//
//   project(item, ctx) -> { position: [x,y,z], normal: [x,y,z], scale: number }
//
//   item = { coord: "1.1.1/1.1.1/1.1.1", comps: [lb,sf,sr, cn,vm,bk, ch,sn,sc] }
//   ctx  = { items, rankOf } — rankOf maps each axis-triple string to a dense
//          rank (0..n-1) over the corpus, so sparse coordinates tile tightly.
//
// The panel's local +Z faces along `normal`. User overrides (the mapping
// layer) replace a projection pose wholesale; see src/mapping.js.

// Rank the distinct values of one axis-triple (z, y, or x group of 3),
// ordered numerically by component, as the reference Coordinate orders them.
function tripleRanks(items, offset) {
  const seen = new Map();
  const keys = items.map((it) => it.comps.slice(offset, offset + 3).join('.'));
  [...new Set(keys)]
    .sort((a, b) => {
      const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
      for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
      return 0;
    })
    .forEach((k, i) => seen.set(k, i));
  return (item) => seen.get(item.comps.slice(offset, offset + 3).join('.'));
}

export function makeContext(items) {
  return {
    items,
    zRank: tripleRanks(items, 0), // library.shelf.series
    yRank: tripleRanks(items, 3), // collection.volume.book
    xRank: tripleRanks(items, 6), // chapter.section.scroll
    count: (fn) => Math.max(0, ...items.map(fn)) + 1,
  };
}

// ---------------------------------------------------------------------------
// Lattice Room: the corpus tiles a room as a 3D grid.
//   scene X <- x-triple rank (chapter.section.scroll — reading order)
//   scene Y <- y-triple rank (collection.volume.book — shelf height)
//   scene Z <- z-triple rank (library.shelf.series — room depth)
// Panels face +Z, toward the aisle the camera starts in.
// ---------------------------------------------------------------------------
export const lattice = {
  id: 'lattice',
  name: 'Lattice Room — tile the corpus as a 3D grid',
  project(item, ctx) {
    const sx = 1.9, sy = 2.3, sz = 1.9;
    const nx = ctx.count(ctx.xRank), ny = ctx.count(ctx.yRank);
    return {
      position: [
        (ctx.xRank(item) - (nx - 1) / 2) * sx,
        0.85 + ctx.yRank(item) * sy,
        (ctx.zRank(item)) * -sz,
      ],
      normal: [0, 0, 1],
      scale: 1,
    };
  },
};

// ---------------------------------------------------------------------------
// Scroll Shell: concentric spheres, one shell per z-triple, scrolls laid out
// by golden-angle spiral within their shell, faces pointing outward. The same
// corpus under a genuinely different mapping: depth becomes radius.
// ---------------------------------------------------------------------------
export const shell = {
  id: 'shell',
  name: 'Scroll Shell — concentric spheres by library triple',
  project(item, ctx) {
    const zr = ctx.zRank(item);
    const inShell = ctx.items.filter((it) => ctx.zRank(it) === zr);
    const j = inShell.indexOf(item);
    const n = inShell.length;
    const radius = 5 + zr * 3.2;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = n === 1 ? 0 : 1 - (2 * (j + 0.5)) / n;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * j;
    const pos = [
      radius * ring * Math.cos(theta),
      1.5 + radius * y * 0.82,
      radius * ring * Math.sin(theta),
    ];
    const len = Math.hypot(pos[0], 0, pos[2]) || 1;
    return { position: pos, normal: [pos[0] / len, 0, pos[2] / len], scale: 1 };
  },
};

export const PROJECTIONS = [lattice, shell];
