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

test('children selections each contain their own pajamas destination', () => {
  const menus = compile('app/lib/mega-menu.ts', { './catalog-navigation': navigation });
  const children = menus.megaMenuSections.find(section => section.key === 'crianca');
  for (const [title, slug] of [['Meninos', 'crianca-meninos-pijama'], ['Meninas', 'crianca-meninas-pijama']]) {
    const column = children.columns.find(column => column.title === title);
    assert.equal(column.links.find(link => link.label === 'Pijama').href, `/catalogo/categoria/${slug}`);
    assert.equal(navigation.isCatalogCategory(slug), true);
  }
  for (const slug of ['pijamas', 'pijamas-meninas', 'pijamas-meninos']) assert.equal(navigation.isCatalogCategory(slug), true);
  assert.equal(navigation.categoryLabel('pijamas-meninas'), 'Pijamas para meninas');
  assert.equal(navigation.categoryLabel('pijamas-meninos'), 'Pijamas para meninos');
});

test('VLT MAR025CT is published in boys pajamas with the supplied price and sizes', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const piece = products.find(product => product.handle === 'pijama-menino-carrinho-azul');
  assert.ok(piece);
  assert.equal(products.filter(product => product.reference === 'VLT MAR025CT').length, 5);
  assert.equal(piece.price, 248);
  assert.deepEqual(piece.sizes, ['18M', '2A', '4A', '6A', '8A']);
  for (const slug of ['pijamas-meninos', 'pijamas', 'crianca', 'todos']) assert.equal(navigation.matchesCatalogCategory(piece, slug), true, slug);
  for (const slug of ['pijamas-meninas', 'bebe', 'vestidos-crianca']) assert.equal(navigation.matchesCatalogCategory(piece, slug), false, slug);
  assert.deepEqual(piece.displayImages, ['/catalog-pijamas/pijama-menino-vlt-mar025ct-etiqueta-original-valutin.jpg']);
  assert.equal(piece.linxSku, undefined);
  assert.equal(piece.stock, undefined);
});

test('all three supplied pajama prints share the commercial data but have distinct photos', () => {
  const products = JSON.parse(read('app/lib/catalog.json')).filter(product => product.reference === 'VLT MAR025CT' && !product.handle.startsWith('pijama-menino-elefantinho-'));
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
  assert.deepEqual(piece.displayImages, ['/catalog-pijamas/pijama-menino-elefantinho-vlt-mar025ct-etiqueta-original-valutin.jpg']);
});

test('green elephant pajamas match the other pajamas and only offer 10A, 12A and 14A for boys', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const piece = products.find(product => product.handle === 'pijama-menino-elefantinho-verde');
  const blue = products.find(product => product.handle === 'pijama-menino-elefantinho-azul');
  assert.ok(piece);
  assert.equal(piece.reference, blue.reference);
  assert.equal(piece.price, 248);
  assert.deepEqual(piece.sizes, ['10A', '12A', '14A']);
  for (const slug of ['crianca-meninos-pijama', 'pijamas-meninos', 'crianca']) assert.equal(navigation.matchesCatalogCategory(piece, slug), true, slug);
  for (const slug of ['crianca-meninas', 'bebe', 'pijamas-meninas']) assert.equal(navigation.matchesCatalogCategory(piece, slug), false, slug);
  assert.deepEqual(piece.displayImages, ['/catalog-pijamas/pijama-menino-elefantinho-verde-vlt-mar025ct-etiqueta-original-valutin.jpg']);
  assert.notDeepEqual(piece.images, blue.images);
  assert.equal(piece.stock, undefined);
  assert.equal(piece.linxSku, undefined);
});

test('VLT MAR026CT has five distinct girls pajamas with the supplied price and all nine sizes', () => {
  const pieces = JSON.parse(read('app/lib/catalog.json')).filter(product => product.reference === 'VLT MAR026CT');
  assert.equal(pieces.length, 5);
  assert.equal(new Set(pieces.flatMap(product => product.images)).size, 5);
  for (const piece of pieces) {
    assert.equal(piece.price, 248);
    assert.deepEqual(piece.sizes, ['12M', '18M', '2A', '4A', '6A', '8A', '10A', '12A', '14A']);
    for (const slug of ['crianca-meninas-pijama', 'pijamas-meninas', 'pijamas', 'crianca']) assert.equal(navigation.matchesCatalogCategory(piece, slug), true, slug);
    for (const slug of ['crianca-meninos', 'pijamas-meninos', 'bebe']) assert.equal(navigation.matchesCatalogCategory(piece, slug), false, slug);
    assert.deepEqual(piece.images, piece.displayImages);
    assert.equal(piece.stock, undefined);
    assert.equal(piece.linxSku, undefined);
  }
});

test('sailor bear pajamas use the same supplied commercial data and their own photo', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const piece = products.find(product => product.handle === 'pijama-menino-urso-marinheiro-azul-marinho');
  assert.ok(piece);
  assert.equal(piece.reference, 'VLT MAR025CT');
  assert.equal(piece.price, 248);
  assert.deepEqual(piece.sizes, ['18M', '2A', '4A', '6A', '8A']);
  assert.deepEqual(piece.displayImages, ['/catalog-pijamas/pijama-menino-urso-marinheiro-vlt-mar025ct-etiqueta-original-valutin.jpg']);
  assert.equal(navigation.matchesCatalogCategory(piece, 'pijamas-meninos'), true);
  assert.equal(navigation.matchesCatalogCategory(piece, 'pijamas'), true);
  assert.equal(navigation.matchesCatalogCategory(piece, 'pijamas-meninas'), false);
});
