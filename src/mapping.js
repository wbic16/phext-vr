// The mapping layer: user-arranged poses, stored OUTSIDE the phext.
//
// A mapping is { [coordinate]: pose } where pose = {
//   p: [x, y, z],          // position
//   q: [x, y, z, w],       // orientation quaternion
//   s: number              // uniform scale
// }
//
// Sliding a scroll in the scene writes an override here. The phext file is
// never mutated by layout. Mappings persist in localStorage (keyed by a
// content hash of the corpus, so each corpus keeps its own arrangement),
// export/import as a JSON file, overlap freely (no collision rules — any
// mapping the user wants), and reset to the pure projection on demand.

const KEY_PREFIX = 'phext-vr:mapping:v1:';
const FORMAT = 'phext-vr-mapping/1';

export class MappingStore {
  constructor(corpusId) {
    this.key = KEY_PREFIX + corpusId;
    this.map = {};
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) this.map = JSON.parse(raw).overrides || {};
    } catch { this.map = {}; }
  }

  get size() { return Object.keys(this.map).length; }
  get(coord) { return this.map[coord] || null; }

  set(coord, pose) {
    this.map[coord] = pose;
    this.save();
  }

  clear() {
    this.map = {};
    this.save();
  }

  save() {
    try { localStorage.setItem(this.key, JSON.stringify({ format: FORMAT, overrides: this.map })); }
    catch { /* storage full/unavailable — mapping still lives in memory */ }
  }

  exportJSON(corpusName) {
    return JSON.stringify({
      format: FORMAT,
      corpus: corpusName,
      exported: new Date().toISOString(),
      overrides: this.map,
    }, null, 2);
  }

  // Returns the number of overrides imported. Throws on a foreign format.
  importJSON(text) {
    const data = JSON.parse(text);
    if (data.format !== FORMAT || typeof data.overrides !== 'object') {
      throw new Error('not a phext-vr mapping file');
    }
    let n = 0;
    for (const [coord, pose] of Object.entries(data.overrides)) {
      if (pose && Array.isArray(pose.p) && Array.isArray(pose.q)) { this.map[coord] = pose; n++; }
    }
    this.save();
    return n;
  }
}

// Corpus identity for keying mappings: SHA-256 of the phext text (identity
// only — parsing is libphext's job, never this module's). Falls back to a
// small FNV-1a hash where crypto.subtle is unavailable (non-secure context).
export async function corpusId(text) {
  if (crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return 'fnv' + h.toString(16).padStart(8, '0');
}
