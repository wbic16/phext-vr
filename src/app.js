// phext-vr — layer phext scrolls into a 3D scene.
// Pipeline: phext text --(libphext, the reference parser)--> scrolls at 9D
// coordinates --(projection, computed on demand)--> scene poses
// --(mapping layer overrides, from sliding)--> final arrangement.
// The phext is never mutated by layout. See DESIGN.md.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { Phext, Coordinate } from 'libphext';
import { PROJECTIONS, makeContext } from './projections.js';
import { MappingStore, corpusId } from './mapping.js';
import { Panel, THEMES } from './panel.js';

const phext = new Phext();

// ---------------------------------------------------------------- theme
const themeName = (() => {
  const saved = localStorage.getItem('phext-vr:theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
})();
let theme = THEMES[themeName];
document.documentElement.dataset.theme = themeName;

// ---------------------------------------------------------------- scene
const container = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

const scene = new THREE.Scene();
scene.background = new THREE.Color(theme.sceneBg);
scene.fog = new THREE.Fog(theme.fog, 30, 90);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.05, 400);
camera.position.set(0, 1.7, 6);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.4, 0);
controls.enableDamping = true;

const grid = new THREE.GridHelper(240, 120, theme.grid, theme.grid);
grid.material.transparent = true;
grid.material.opacity = 0.32;
scene.add(grid);

const world = new THREE.Group();
scene.add(world);

// ---------------------------------------------------------------- state
let panels = new Map();       // coord -> Panel
let items = [];               // [{coord, comps, text}]
let projection = PROJECTIONS[0];
let store = null;             // MappingStore for the loaded corpus
let corpusName = '';
let selected = null;          // Panel
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const animHooks = [];
function setAnimationHook(fn) { animHooks.push(fn); }

const $ = (id) => document.getElementById(id);
function status(msg) { $('status').textContent = msg; }
function refreshMappingNote() {
  $('mapping-note').textContent = store && store.size
    ? `${store.size} scroll${store.size === 1 ? '' : 's'} moved by hand — saved in this browser, outside the phext`
    : 'pure projection — no scroll has been moved by hand';
  if (selected) showSelected();
}
function showSelected() {
  $('selected-note').textContent = selected
    ? `${selected.coord} · page ${selected.page + 1}/${selected.pageCount} · drag to slide · Alt+drag to turn`
    : 'no scroll selected — click one';
}

// ---------------------------------------------------------------- poses
function compsOf(coordStr) {
  const c = new Coordinate(coordStr);
  return [c.z.library, c.z.shelf, c.z.series, c.y.collection, c.y.volume, c.y.book, c.x.chapter, c.x.section, c.x.scroll];
}

function projectedPose(item, ctx) {
  const pose = projection.project(item, ctx);
  const m = new THREE.Object3D();
  m.position.fromArray(pose.position);
  const target = m.position.clone().add(new THREE.Vector3().fromArray(pose.normal));
  m.lookAt(target);
  m.scale.setScalar(pose.scale);
  return { p: m.position.toArray(), q: m.quaternion.toArray(), s: pose.scale };
}

function applyPose(panel, pose) {
  panel.group.position.fromArray(pose.p);
  panel.group.quaternion.fromArray(pose.q);
  panel.group.scale.setScalar(pose.s ?? 1);
}

function poseOf(panel) {
  return {
    p: panel.group.position.toArray(),
    q: panel.group.quaternion.toArray(),
    s: panel.group.scale.x,
  };
}

// Recompute every pose: overrides win, projection fills the rest.
function layout() {
  const ctx = makeContext(items);
  for (const item of items) {
    const panel = panels.get(item.coord);
    const override = store ? store.get(item.coord) : null;
    applyPose(panel, override || projectedPose(item, ctx));
  }
  refreshMappingNote();
}

// ---------------------------------------------------------------- corpus
async function loadCorpus(text, name) {
  const exploded = phext.explode(text);
  if (exploded.size === 0) { status(`no scrolls found in ${name}`); return; }
  corpusName = name;
  store = new MappingStore(await corpusId(text));
  // canonical order, by the reference Coordinate ordering
  const coords = [...exploded.keys()].sort((a, b) => {
    const ca = new Coordinate(a), cb = new Coordinate(b);
    return ca.less_than(cb) ? -1 : ca.greater_than(cb) ? 1 : 0;
  });
  items = coords.map((coord) => ({ coord, comps: compsOf(coord), text: exploded.get(coord) }));

  for (const panel of panels.values()) {
    world.remove(panel.group);
    panel.texture.dispose(); panel.mesh.geometry.dispose(); panel.frame.geometry.dispose();
  }
  panels = new Map();
  for (const item of items) {
    const panel = new Panel(item.coord, item.text, theme);
    panels.set(item.coord, panel);
    world.add(panel.group);
  }
  selected = null;
  layout();
  frameCluster();
  status(`${name} — ${items.length} scrolls · projection: ${projection.name}`);
  showSelected();
}

function bboxOf(list) {
  const box = new THREE.Box3();
  for (const p of list) box.expandByPoint(p.group.position);
  return box;
}
function frameAll() {
  if (!panels.size) return;
  const box = bboxOf([...panels.values()]);
  const c = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  controls.target.copy(c);
  camera.position.copy(c).add(new THREE.Vector3(0, size * 0.15, size * 0.62 + 2));
}
function frameCluster() {
  if (!panels.size) return frameAll();
  const ctx = makeContext(items);
  const home = items.filter((it) => ctx.zRank(it) === 0 && ctx.yRank(it) === 0).map((it) => panels.get(it.coord));
  const box = bboxOf(home.length ? home : [...panels.values()]);
  const c = box.getCenter(new THREE.Vector3());
  controls.target.copy(c);
  camera.position.copy(c).add(new THREE.Vector3(0, 0.3, 5.2));
}

// ---------------------------------------------------------------- sliding
const dragPlane = new THREE.Plane();
let drag = null; // {panel, mode:'slide'|'turn', offset, startX, startY, startQ}

function panelFromObject(obj) {
  while (obj) { if (obj.userData.coord) return panels.get(obj.userData.coord); obj = obj.parent; }
  return null;
}
function castAt(clientX, clientY) {
  pointer.set((clientX / innerWidth) * 2 - 1, -(clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(world.children, true);
  return hits.length ? { panel: panelFromObject(hits[0].object), point: hits[0].point } : null;
}
function select(panel) {
  if (selected) selected.setSelected(false);
  selected = panel;
  if (selected) selected.setSelected(true);
  showSelected();
}
function beginDrag(panel, point, rayDir, mode) {
  dragPlane.setFromNormalAndCoplanarPoint(rayDir, point);
  drag = {
    panel, mode,
    offset: point.clone().sub(panel.group.position),
    startX: null, startY: null, startQ: panel.group.quaternion.clone(),
  };
  controls.enabled = false;
  select(panel);
}
function moveDrag(point) {
  if (!drag) return;
  drag.panel.group.position.copy(point.clone().sub(drag.offset));
}
function endDrag() {
  if (!drag) return;
  store.set(drag.panel.coord, poseOf(drag.panel));
  drag = null;
  controls.enabled = true;
  refreshMappingNote();
}

const dom = renderer.domElement;
dom.addEventListener('pointerdown', (e) => {
  const hit = castAt(e.clientX, e.clientY);
  if (!hit || !hit.panel) { select(null); return; }
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  beginDrag(hit.panel, hit.point, dir, (e.altKey || e.button === 2) ? 'turn' : 'slide');
  drag.startX = e.clientX; drag.startY = e.clientY;
  // Capture keeps the drag alive outside the canvas; it can only fail for
  // synthetic or already-released pointers, where window-level moves suffice.
  try { dom.setPointerCapture(e.pointerId); } catch { /* no active pointer to capture */ }
});
dom.addEventListener('pointermove', (e) => {
  if (!drag) return;
  if (drag.mode === 'turn') {
    const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (e.clientX - drag.startX) * 0.006);
    const pitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (e.clientY - drag.startY) * 0.006);
    drag.panel.group.quaternion.copy(yaw).multiply(drag.startQ).multiply(pitch);
    return;
  }
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const pt = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(dragPlane, pt)) moveDrag(pt);
});
dom.addEventListener('pointerup', endDrag);
dom.addEventListener('contextmenu', (e) => e.preventDefault());
dom.addEventListener('wheel', (e) => {
  const hit = castAt(e.clientX, e.clientY);
  const panel = (hit && hit.panel) || selected;
  if (panel && panel.pageCount > 1) {
    e.preventDefault();
    select(panel);
    panel.setPage(panel.page + (e.deltaY > 0 ? 1 : -1));
    showSelected();
  }
}, { passive: false });
addEventListener('keydown', (e) => {
  if (!selected) return;
  if (e.key === 'PageDown') selected.setPage(selected.page + 1);
  if (e.key === 'PageUp') selected.setPage(selected.page - 1);
  showSelected();
});

// XR controllers: same grab/slide/persist path, driven by the controller ray.
for (const idx of [0, 1]) {
  const controller = renderer.xr.getController(idx);
  const rayGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -6)]);
  controller.add(new THREE.Line(rayGeo, new THREE.LineBasicMaterial({ color: theme.frameSelected })));
  let xrDrag = null;
  controller.addEventListener('selectstart', () => {
    const m = new THREE.Matrix4().identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(m);
    const hits = raycaster.intersectObjects(world.children, true);
    if (!hits.length) return;
    const panel = panelFromObject(hits[0].object);
    if (!panel) return;
    const dir = raycaster.ray.direction.clone();
    dragPlane.setFromNormalAndCoplanarPoint(dir, hits[0].point);
    xrDrag = { panel, offset: hits[0].point.clone().sub(panel.group.position) };
    select(panel);
  });
  controller.addEventListener('selectend', () => {
    if (xrDrag) { store.set(xrDrag.panel.coord, poseOf(xrDrag.panel)); xrDrag = null; refreshMappingNote(); }
  });
  controller.addEventListener('connected', () => { controller.userData.dragRef = () => xrDrag; });
  scene.add(controller);
  // per-frame: while an XR grab is held, follow the controller ray
  setAnimationHook(() => {
    if (!xrDrag || !renderer.xr.isPresenting) return;
    const m = new THREE.Matrix4().identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(m);
    const pt = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(dragPlane, pt)) {
      xrDrag.panel.group.position.copy(pt.clone().sub(xrDrag.offset));
    }
  });
}

// ---------------------------------------------------------------- HUD
$('projection').addEventListener('change', (e) => {
  projection = PROJECTIONS.find((p) => p.id === e.target.value) || PROJECTIONS[0];
  layout();
  frameAll();
  status(`${corpusName} — ${items.length} scrolls · projection: ${projection.name}`);
});
$('frame-all').addEventListener('click', frameAll);
$('load-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) loadCorpus(await file.text(), file.name);
});
$('export-mapping').addEventListener('click', () => {
  if (!store) return;
  const blob = new Blob([store.exportJSON(corpusName)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob), download: 'phext-vr-mapping.json',
  });
  a.click(); URL.revokeObjectURL(a.href);
});
$('import-mapping').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file || !store) return;
  try {
    const n = store.importJSON(await file.text());
    layout();
    status(`imported ${n} mapping override${n === 1 ? '' : 's'}`);
  } catch (err) { status(`import failed: ${err.message}`); }
});
$('reset-mapping').addEventListener('click', () => {
  if (!store) return;
  store.clear();
  layout();
  status('mapping reset — pure projection');
});
$('page-prev').addEventListener('click', () => { if (selected) { selected.setPage(selected.page - 1); showSelected(); } });
$('page-next').addEventListener('click', () => { if (selected) { selected.setPage(selected.page + 1); showSelected(); } });
$('theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('phext-vr:theme', next);
  theme = THEMES[next];
  scene.background.set(theme.sceneBg);
  scene.fog.color.set(theme.fog);
  grid.material.color.set(theme.grid);
  for (const panel of panels.values()) panel.setTheme(theme);
});

// ---------------------------------------------------------------- go
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
renderer.setAnimationLoop(() => {
  for (const fn of animHooks) fn();
  controls.update();
  renderer.render(scene, camera);
});

fetch('sample/incipit-excerpt.phext')
  .then((r) => r.text())
  .then((text) => loadCorpus(text, 'incipit-excerpt.phext'))
  .catch((err) => status(`could not load the sample corpus: ${err.message}`));
