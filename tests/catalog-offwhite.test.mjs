import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const mapping = JSON.parse(read('app/lib/catalog-offwhite.json'));
const helpers = {};
vm.runInNewContext(ts.transpileModule(read('app/lib/catalog-offwhite.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, { exports: helpers, require: name => {
  assert.equal(name, './catalog-offwhite.json');
  return mapping;
} });

test('off-white copies keep the original photo files and cover every selected gallery view', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const originals = new Set(products.flatMap(product => product.displayImages));
  assert.equal(Object.keys(mapping).length, 58);
  for (const [source, output] of Object.entries(mapping)) {
    assert.ok(originals.has(source));
    assert.ok(output.startsWith('/catalog-offwhite/'));
    assert.ok(existsSync(new URL(`../public${source}`, import.meta.url)));
    assert.ok(existsSync(new URL(`../public${output}`, import.meta.url)));
  }
});

test('photo presentation changes neither product information nor original galleries', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const snapshot = JSON.stringify(products);
  const result = helpers.applyOffwhitePhotos(products);
  assert.equal(result.length, products.length);
  result.forEach((product, index) => {
    const { displayImages, ...details } = product;
    const { displayImages: originalViews, ...originalDetails } = products[index];
    assert.deepEqual(details, originalDetails);
    assert.equal(displayImages.length, originalViews.length);
    originalViews.forEach((src, view) => assert.equal(displayImages[view], mapping[src] ?? src));
  });
  assert.equal(JSON.stringify(products), snapshot);
  const warm = '/catalog-outubro/00000483-PHOTO-2026-09-29-18-38-38.jpg';
  assert.equal(helpers.offwhitePhoto(warm), warm);
  assert.equal(helpers.offwhitePhoto('/api/editor/media?path=catalogo/new.jpg'), '/api/editor/media?path=catalogo/new.jpg');
  assert.equal(JSON.stringify(helpers.applyOffwhitePhotos(result)), JSON.stringify(result));
});
