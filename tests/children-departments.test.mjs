import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url), ts = require('typescript');
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function compile(path, modules = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, { exports, require: name => { assert.ok(name in modules, name); return modules[name]; } });
  return exports;
}
const nav = compile('app/lib/catalog-navigation.ts');
const { catalogProducts: products } = compile('app/lib/catalog-individual.ts', { './catalog.json': JSON.parse(read('app/lib/catalog.json')) });
const plain = value => JSON.parse(JSON.stringify(value));

test('children open boys and girls with the requested separate categories', () => {
  assert.deepEqual(plain(nav.departments.find(item => item.slug === 'crianca').links), ['crianca-meninos', 'crianca-meninas']);
  for (const [section, labels] of [
    ['crianca-meninos', ['Camisetas', 'Camisa/Batas', 'Shorts/Bermudas', 'Conjuntos', 'Calças', 'Cardigan', 'Pijama']],
    ['crianca-meninas', ['Camisa/Batas', 'Shorts/Shorts-saia', 'Conjuntos', 'Saia', 'Calças', 'Vestido', 'Cardigan', 'Pijama']],
  ]) assert.deepEqual(plain(nav.childrenCategories.filter(item => item.parent === section).map(item => item.label)), labels);
  const menu = compile('app/lib/mega-menu.ts', { './catalog-navigation': nav }).megaMenuSections.find(item => item.key === 'crianca');
  assert.deepEqual(plain(menu.columns.slice(0, 2).map(item => item.title)), ['Meninos', 'Meninas']);
  for (const category of nav.childrenCategories) {
    assert.equal(nav.isCatalogCategory(category.slug), true);
    assert.ok(menu.columns.flatMap(item => item.links).some(link => link.href === nav.categoryHref(category.slug)));
  }
});

test('all current children pieces are classified without changing commercial data', () => {
  const snapshot = JSON.stringify(products);
  for (const product of products) {
    const eligible = product.category === 'crianca' || product.additionalDepartments?.includes('crianca');
    const assignment = nav.childrenClassification(product);
    if (!eligible) { assert.equal(assignment, undefined, product.handle); continue; }
    assert.ok(assignment, product.handle);
    const matches = nav.childrenCategories.filter(category => nav.matchesCatalogCategory(product, category.slug));
    assert.equal(matches.length, assignment.audiences.length, product.handle);
    assert.ok(matches.every(category => category.type === assignment.type), product.handle);
  }
  assert.equal(JSON.stringify(products), snapshot);
});

test('T-shirts, shirts, shorts and skirts no longer share the same results', () => {
  const shirts = products.filter(product => nav.childrenClassification(product)?.type === 'camisetas');
  assert.equal(shirts.length, 10);
  for (const shirt of shirts) {
    assert.equal(nav.matchesCatalogCategory(shirt, 'crianca-meninos-camisetas'), true, shirt.handle);
    assert.equal(nav.matchesCatalogCategory(shirt, 'crianca-meninas'), false, shirt.handle);
  }
  assert.equal(nav.isCatalogCategory('crianca-meninas-camisetas'), false);
  for (const [handle, included, excluded] of [
    ['camiseta-algodao-veleiro-01', 'crianca-meninos-camisetas', 'crianca-meninos-camisa-batas'],
    ['camisa-linho', 'crianca-meninos-camisa-batas', 'crianca-meninos-camisetas'],
    ['regata-floral-babados', 'crianca-meninas-camisa-batas', 'crianca-meninas-camisetas'],
    ['saia-algodao-azul', 'crianca-meninas-saia', 'crianca-meninas-shorts'],
    ['bermuda-linho-verde', 'crianca-meninos-shorts', 'crianca-meninas-shorts'],
    ['bermuda-linho-azul-marinho', 'crianca-meninos-shorts', 'crianca-meninas-shorts'],
    ['bermuda-linho-caqui', 'crianca-meninos-shorts', 'crianca-meninas-shorts'],
    ['bermuda-moletom', 'crianca-meninos-shorts', 'crianca-meninas-shorts'],
    ['conjunto-laise-rosa', 'crianca-meninas-conjuntos', 'crianca-meninas-vestido'],
    ['cardigan-bordado-analu', 'crianca-meninas-cardigan', 'crianca-meninos-cardigan'],
  ]) {
    const product = products.find(item => item.handle === handle);
    assert.ok(product, handle);
    assert.equal(nav.matchesCatalogCategory(product, included), true, handle);
    assert.equal(nav.matchesCatalogCategory(product, excluded), false, handle);
  }
});

test('boys shirt and shared baby/children products preserve the correct breadcrumb context', () => {
  const shirt = products.find(item => item.handle === 'camisa-linho');
  const category = 'crianca-meninos-camisa-batas';
  assert.equal(nav.matchesCatalogCategory(shirt, category), true);
  assert.equal(nav.productCategoryTrail(shirt, category).at(-1).slug, category);
  assert.equal(nav.matchesCatalogCategory(shirt, 'crianca-meninas'), false);
  assert.equal(nav.matchesCatalogCategory(shirt, 'crianca-meninas-camisa-batas'), false);
  assert.equal(nav.productCategoryTrail(shirt, 'crianca-meninas-camisa-batas').at(-1).slug, 'crianca-meninos-camisa-batas');
  const dress = products.find(item => item.handle === 'vestido-algodao-bordado');
  assert.equal(nav.productCategoryTrail(dress, 'bebe-meninas-vestido')[0].slug, 'bebe');
  assert.equal(nav.productCategoryTrail(dress, 'crianca-meninas-vestido')[0].slug, 'crianca');
  assert.deepEqual(plain(nav.categoryAncestors('crianca-meninos-calcas')), ['crianca', 'crianca-meninos']);
});

test('pants and empty categories remain empty rather than borrowing other garment types', () => {
  for (const slug of ['crianca-meninos-calcas', 'crianca-meninas-calcas', 'crianca-meninos-cardigan', 'crianca-meninos-conjuntos']) {
    assert.equal(nav.isCatalogCategory(slug), true);
    assert.equal(products.filter(product => nav.matchesCatalogCategory(product, slug)).length, 0, slug);
  }
});
