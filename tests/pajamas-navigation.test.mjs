import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function compile(path, modules = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, require: name => { assert.ok(name in modules, name); return modules[name]; } });
  return exports;
}
const navigation = compile('app/lib/catalog-navigation.ts');

test('pajamas combine girls and boys only within the children department', () => {
  const products = [
    { handle: 'girl', category: 'crianca', catalogCategory: 'pijamas-meninas' },
    { handle: 'boy', category: 'crianca', catalogCategory: 'pijamas-meninos' },
    { handle: 'general', category: 'crianca', catalogCategory: 'pijamas' },
    { handle: 'dress', category: 'crianca', catalogCategory: 'vestidos' },
    { handle: 'baby', category: 'bebe', catalogCategory: 'pijamas-meninas' },
  ];
  const handles = slug => products.filter(product => navigation.matchesCatalogCategory(product, slug)).map(product => product.handle);
  assert.deepEqual(handles('pijamas'), ['girl', 'boy', 'general']);
  assert.deepEqual(handles('pijamas-meninas'), ['girl']);
  assert.deepEqual(handles('pijamas-meninos'), ['boy']);
  assert.deepEqual(handles('crianca'), ['girl', 'boy', 'general', 'dress']);
});

test('children menu contains pajamas with separate girls and boys destinations', () => {
  const menus = compile('app/lib/mega-menu.ts', { './catalog-navigation': navigation });
  const children = menus.megaMenuSections.find(section => section.key === 'crianca');
  const pajamas = children.columns.flatMap(column => column.links).find(link => link.label === 'Pijamas');
  assert.equal(pajamas.href, '/catalogo/categoria/pijamas');
  assert.equal(pajamas.children.length, 2);
  assert.equal(pajamas.children[0].label, 'Meninas');
  assert.equal(pajamas.children[0].href, '/catalogo/categoria/pijamas-meninas');
  assert.equal(pajamas.children[1].label, 'Meninos');
  assert.equal(pajamas.children[1].href, '/catalogo/categoria/pijamas-meninos');
  for (const slug of ['pijamas', 'pijamas-meninas', 'pijamas-meninos']) assert.equal(navigation.isCatalogCategory(slug), true);
  assert.equal(navigation.categoryLabel('pijamas-meninas'), 'Pijamas para meninas');
  assert.equal(navigation.categoryLabel('pijamas-meninos'), 'Pijamas para meninos');
});

test('VLT MAR025CT is published in boys pajamas with the supplied price and sizes', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const piece = products.find(product => product.handle === 'pijama-menino-carrinho-azul');
  assert.ok(piece);
  assert.equal(products.filter(product => product.reference === 'VLT MAR025CT').length, 4);
  assert.equal(piece.price, 248);
  assert.deepEqual(piece.sizes, ['18M', '2A', '4A', '6A', '8A']);
  for (const slug of ['pijamas-meninos', 'pijamas', 'crianca', 'todos']) assert.equal(navigation.matchesCatalogCategory(piece, slug), true, slug);
  for (const slug of ['pijamas-meninas', 'bebe', 'vestidos-crianca']) assert.equal(navigation.matchesCatalogCategory(piece, slug), false, slug);
  assert.deepEqual(piece.displayImages, ['/catalog-pijamas/pijama-menino-vlt-mar025ct.jpg']);
  assert.equal(piece.linxSku, undefined);
  assert.equal(piece.stock, undefined);
});

test('all three supplied pajama prints share the commercial data but have distinct photos', () => {
  const products = JSON.parse(read('app/lib/catalog.json')).filter(product => product.reference === 'VLT MAR025CT' && product.handle !== 'pijama-menino-elefantinho-azul');
  assert.equal(products.length, 3);
  assert.equal(new Set(products.map(product => product.displayImages[0])).size, 3);
  for (const product of products) {
    assert.equal(product.price, 248);
    assert.deepEqual(product.sizes, ['18M', '2A', '4A', '6A', '8A']);
    assert.equal(navigation.matchesCatalogCategory(product, 'pijamas-meninos'), true);
    assert.equal(navigation.matchesCatalogCategory(product, 'pijamas'), true);
    assert.equal(navigation.matchesCatalogCategory(product, 'pijamas-meninas'), false);
  }
});

test('elephant pajamas have only the requested 10A, 12A and 14A sizes', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const piece = products.find(product => product.handle === 'pijama-menino-elefantinho-azul');
  assert.ok(piece);
  assert.equal(piece.reference, 'VLT MAR025CT');
  assert.equal(piece.price, 248);
  assert.deepEqual(piece.sizes, ['10A', '12A', '14A']);
  assert.equal(navigation.matchesCatalogCategory(piece, 'pijamas-meninos'), true);
  assert.equal(navigation.matchesCatalogCategory(piece, 'pijamas'), true);
  assert.equal(navigation.matchesCatalogCategory(piece, 'pijamas-meninas'), false);
  assert.deepEqual(piece.displayImages, ['/catalog-pijamas/pijama-menino-elefantinho-vlt-mar025ct.jpg']);
});

test('sailor bear pajamas use the same supplied commercial data and their own photo', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const piece = products.find(product => product.handle === 'pijama-menino-urso-marinheiro-azul-marinho');
  assert.ok(piece);
  assert.equal(piece.reference, 'VLT MAR025CT');
  assert.equal(piece.price, 248);
  assert.deepEqual(piece.sizes, ['18M', '2A', '4A', '6A', '8A']);
  assert.deepEqual(piece.displayImages, ['/catalog-pijamas/pijama-menino-urso-marinheiro-vlt-mar025ct.jpg']);
  assert.equal(navigation.matchesCatalogCategory(piece, 'pijamas-meninos'), true);
  assert.equal(navigation.matchesCatalogCategory(piece, 'pijamas'), true);
  assert.equal(navigation.matchesCatalogCategory(piece, 'pijamas-meninas'), false);
});
