// Conformance test for the vendored reference parser (vendor/libphext.js,
// libphext-node v0.6.1, the JS port of libphext-rs).
//
// Corpus discipline (phext_reference_conformance skill): the fixture was
// written by a DIFFERENT implementation — the Python libphext port
// (PyPI `phext` 0.3.2) via its insert(), plus one raw-byte segment — never by
// the code under test. Shapes chosen to expose a self-consistent wrong parser:
// an empty line inside a scroll, a scroll holding only a newline, a deep
// coordinate with every component != 1, and a library component of 1000
// (past the 999 cap that older ports saturate at; the reference walks the
// raw LIBRARY_BREAK run — 999 breaks from origin — to 1000).
//
// Run: node tests/conformance.mjs   (exit 0 = conformant)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Phext, Coordinate } from '../vendor/libphext.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(join(here, 'fixture.phext'), 'utf8');
const expected = JSON.parse(readFileSync(join(here, 'fixture.expected.json'), 'utf8'));

const phext = new Phext();
let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};

const exploded = phext.explode(fixture);
check('scroll count', exploded.size === Object.keys(expected).length,
  `got ${exploded.size}, expected ${Object.keys(expected).length}`);

for (const [coord, text] of Object.entries(expected)) {
  check(`scroll ${coord} byte-identical`, exploded.get(coord) === text,
    exploded.has(coord) ? `len ${exploded.get(coord).length} vs ${text.length}` : 'missing');
}
for (const coord of exploded.keys()) {
  if (!(coord in expected)) check(`no phantom scroll at ${coord}`, false);
}

// fetch() must agree with explode() at every fixture coordinate
let fetchBad = 0;
for (const coord of Object.keys(expected)) {
  if (phext.fetch(fixture, new Coordinate(coord)) !== expected[coord]) fetchBad++;
}
check('fetch() == explode() at all fixture coords', fetchBad === 0);

// round-trip through the reference serializer preserves the scroll map
const round = phext.explode(phext.implode(exploded));
let rtBad = round.size !== exploded.size ? 1 : 0;
for (const [k, v] of exploded) if (round.get(k) !== v) rtBad++;
check('explode(implode(explode(fixture))) is identity', rtBad === 0);

console.log(failures === 0 ? '\nCONFORMANT' : `\n${failures} FAILURES`);
process.exit(failures ? 1 : 0);
