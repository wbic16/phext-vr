// Scroll panels: a scroll is an unbounded plane of text. The model keeps the
// full text; the panel is a window onto it — lines are wrapped to the panel
// width and paged to the panel height. Paging/wrapping are view concerns;
// nothing here truncates the scroll itself.

import * as THREE from 'three';

const CANVAS_W = 1024;
const PAD_X = 36;
const HEADER_H = 62;
const FOOTER_H = 46;
const FONT_PX = 26;
const LINE_H = 37;
const MAX_LINES = 22;
export const PANEL_W = 1.7; // metres

const FONT = `${FONT_PX}px ui-monospace, "Cascadia Mono", Menlo, Consolas, "Liberation Mono", monospace`;

export const THEMES = {
  dark: {
    sceneBg: 0x0b0b10, fog: 0x0b0b10, grid: 0x2a2a33,
    panelBg: '#121218', text: '#e9e5d9', dim: '#8f8a7c',
    gold: '#d4a017', frame: 0x6b5410, frameSelected: 0xd4a017,
  },
  light: {
    sceneBg: 0xe9e5da, fog: 0xe9e5da, grid: 0xb9b2a0,
    panelBg: '#f7f3e8', text: '#1d1a13', dim: '#6f6a5c',
    gold: '#b8860b', frame: 0xa87f14, frameSelected: 0xb8860b,
  },
};

// Word-wrap one logical line to `width` chars; hard-break overlong words.
function wrapLine(line, width, out) {
  if (line.length <= width) { out.push(line); return; }
  let rest = line;
  while (rest.length > width) {
    let cut = rest.lastIndexOf(' ', width);
    if (cut <= 0) cut = width;
    out.push(rest.slice(0, cut));
    rest = rest.slice(cut).replace(/^ /, '');
  }
  out.push(rest);
}

export function layoutText(text, width) {
  const lines = [];
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) wrapLine(raw, width, lines);
  return lines;
}

export class Panel {
  constructor(coord, text, theme) {
    this.coord = coord;
    this.text = text;
    this.theme = theme;
    this.page = 0;

    const probe = document.createElement('canvas').getContext('2d');
    probe.font = FONT;
    const charW = probe.measureText('M'.repeat(10)).width / 10;
    this.charsPerLine = Math.max(20, Math.floor((CANVAS_W - 2 * PAD_X) / charW));
    this.lines = layoutText(text, this.charsPerLine);
    this.pageCount = Math.max(1, Math.ceil(this.lines.length / MAX_LINES));

    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_W;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.anisotropy = 4;
    this.texture.colorSpace = THREE.SRGBColorSpace;

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(PANEL_W, 1),
      new THREE.MeshBasicMaterial({ map: this.texture }),
    );
    this.mesh.userData.coord = coord;
    this.frame = new THREE.Mesh(
      new THREE.PlaneGeometry(PANEL_W + 0.055, 1),
      new THREE.MeshBasicMaterial({ color: theme.frame }),
    );
    this.frame.position.z = -0.006;
    this.group = new THREE.Group();
    this.group.add(this.frame, this.mesh);
    this.group.userData.coord = coord;

    this.draw();
  }

  get pageLines() { return this.lines.slice(this.page * MAX_LINES, (this.page + 1) * MAX_LINES); }

  draw() {
    const t = this.theme;
    const body = this.pageLines;
    const h = HEADER_H + Math.max(1, body.length) * LINE_H + FOOTER_H;
    this.canvas.height = h;
    const c = this.ctx;
    c.fillStyle = t.panelBg; c.fillRect(0, 0, CANVAS_W, h);
    c.font = FONT; c.textBaseline = 'top';
    // header: the coordinate, in gold (Metallic Golden Phext, flat by rule)
    c.fillStyle = t.gold;
    c.font = `bold ${FONT_PX}px ui-monospace, Menlo, Consolas, monospace`;
    c.fillText(this.coord, PAD_X, 16);
    c.fillRect(PAD_X, HEADER_H - 8, CANVAS_W - 2 * PAD_X, 2);
    // body
    c.font = FONT; c.fillStyle = t.text;
    body.forEach((line, i) => c.fillText(line, PAD_X, HEADER_H + i * LINE_H));
    // footer
    c.fillStyle = t.dim;
    c.font = `${FONT_PX - 5}px ui-monospace, Menlo, Consolas, monospace`;
    const note = this.pageCount > 1
      ? `page ${this.page + 1} / ${this.pageCount} — scroll or PgUp/PgDn to read on`
      : `${this.lines.length} lines`;
    c.fillText(note, PAD_X, h - FOOTER_H + 12);
    this.texture.needsUpdate = true;
    // fit plane height to this page's texture aspect
    const ph = PANEL_W * (h / CANVAS_W);
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.PlaneGeometry(PANEL_W, ph);
    this.frame.geometry.dispose();
    this.frame.geometry = new THREE.PlaneGeometry(PANEL_W + 0.055, ph + 0.055);
  }

  setPage(p) {
    const next = Math.min(this.pageCount - 1, Math.max(0, p));
    if (next !== this.page) { this.page = next; this.draw(); }
    return this.page;
  }

  setTheme(theme) { this.theme = theme; this.frame.material.color.setHex(theme.frame); this.draw(); }
  setSelected(on) {
    this.frame.material.color.setHex(on ? this.theme.frameSelected : this.theme.frame);
    this.frame.scale.setScalar(on ? 1.012 : 1);
  }
}
