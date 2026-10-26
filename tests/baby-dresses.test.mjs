import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const navigation = {};
vm.runInNewContext(ts.transpileModule(read('app/lib/catalog-navigation.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: navigation });

test('baby dress category includes every baby dress and excludes other departments and garments', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const dresses = products.filter(product => navigation.matchesCatalogCategory(product, 'vestidos-bebe'));
  assert.deepEqual(dresses.map(product => product.handle).sort(), [
    'vestido-algodao-bordado', 'vestido-bebe-bordado-azul-kds005ct', 'vestido-bebe-listrado-laranja-ange007bb', 'vestido-bordado-azul-claro', 'vestido-bordado-creme', 'vestido-bordado-listrado-azul', 'vestido-bordado-rosa', 'vestido-bordado-verde', 'vestido-listrado-laranja-pv26-27ange008ct', 'vestido-malha-estampa-exclusiva-vlt-geni012ct', 'vestido-tricoline-estampa-exclusiva-rosas-azuis',
  ]);
  for (const product of products) {
    assert.equal(navigation.matchesCatalogCategory(product, 'vestidos-bebe'), (product.category === 'bebe' || product.additionalDepartments?.includes('bebe') === true) && product.catalogCategory === 'vestidos');
    assert.equal(navigation.matchesCatalogCategory(product, 'vestidos'), product.catalogCategory === 'vestidos');
  }
  assert.equal(navigation.matchesCatalogCategory({ category: 'bebe', catalogCategory: 'vestidos' }, 'vestidos-bebe'), true);
  assert.equal(navigation.matchesCatalogCategory({ category: 'crianca', catalogCategory: 'vestidos' }, 'vestidos-bebe'), false);
  assert.equal(navigation.matchesCatalogCategory({ category: 'bebe', catalogCategory: 'bodys-e-conjuntos' }, 'vestidos-bebe'), false);
});

test('embroidered cotton dress belongs to both departments without duplicating its product', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const dress = products.find(product => product.handle === 'vestido-algodao-bordado');
  for (const slug of ['bebe', 'vestidos-bebe', 'crianca', 'vestidos-crianca']) assert.equal(navigation.matchesCatalogCategory(dress, slug), true, slug);
  assert.equal(products.filter(product => product.handle === dress.handle).length, 1);
  assert.equal(dress.price, 429);
  assert.equal(dress.reference, 'PV/27KDS002CT');
  assert.equal(dress.images.length, 2);
});

test('baby navigation and product breadcrumbs lead to the scoped category', () => {
  assert.equal(navigation.isCatalogCategory('vestidos-bebe'), true);
  assert.equal(navigation.categoryLabel('vestidos-bebe'), 'Vestidos para bebês');
  assert.equal(navigation.categoryHref('vestidos', 'bebe'), '/catalogo/categoria/vestidos-bebe');
  assert.equal(navigation.categoryHref('vestidos', 'crianca'), '/catalogo/categoria/vestidos-crianca');
  assert.ok(navigation.departments.find(department => department.slug === 'bebe').links.includes('bebe-meninas'));
  const menus = {};
  vm.runInNewContext(ts.transpileModule(read('app/lib/mega-menu.ts'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports: menus, require: name => {
    assert.equal(name, './catalog-navigation');
    return navigation;
  } });
  assert.ok(menus.megaMenuSections.find(section => section.key === 'bebe').columns.flatMap(column => column.links)
    .some(link => link.label === 'Vestido' && link.href === '/catalogo/categoria/bebe-meninas-vestido'));
});

test('children dress navigation excludes every baby dress, including the cream dress', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const cream = products.find(product => product.handle === 'vestido-bordado-creme');
  assert.equal(navigation.matchesCatalogCategory(cream, 'vestidos-crianca'), false);
  assert.equal(navigation.matchesCatalogCategory(cream, 'crianca'), false);
  assert.equal(navigation.matchesCatalogCategory(cream, 'vestidos-bebe'), true);
  const selected = products.filter(product => navigation.matchesCatalogCategory(product, 'vestidos-crianca'));
  assert.ok(selected.length > 0);
  assert.ok(selected.every(product => product.category === 'crianca' && product.catalogCategory === 'vestidos'));
  assert.equal(navigation.matchesCatalogCategory(cream, 'vestidos'), true);
});


test('exclusive blue rose dress has one record, baby size 2A, and full child range', () => {
  const products = JSON.parse(read('app/lib/catalog.json'));
  const dress = products.find(p => p.handle === 'vestido-tricoline-estampa-exclusiva-rosas-azuis');
  assert.equal(products.filter(p => p.handle === dress.handle).length, 1);
  assert.equal(dress.price, 428);
  for (const slug of ['bebe-meninas-vestido', 'vestidos-bebe', 'bebe']) {
    assert.equal(navigation.matchesCatalogCategory(dress, slug), true);
    assert.deepEqual(Array.from(navigation.productForCategory(dress, slug).sizes), ['2A']);
  }
  for (const slug of ['crianca-meninas-vestido', 'vestidos-crianca', undefined]) {
    assert.deepEqual(Array.from(navigation.productForCategory(dress, slug).sizes), ['2A','4A','6A','8A','10A']);
  }
  assert.equal(navigation.matchesCatalogCategory(dress, 'bebe-meninos'), false);
  assert.equal(navigation.matchesCatalogCategory(dress, 'crianca-meninos'), false);
  assert.deepEqual(dress.sizes, ['2A','4A','6A','8A','10A']);
  assert.equal(dress.images.length, 2);
});


test('floral knit dress appears in girls children and keeps only 2A in babies', () => {
  const dress = JSON.parse(read('app/lib/catalog.json')).find(p => p.handle === 'vestido-malha-estampa-exclusiva-vlt-geni012ct');
  assert.equal(dress.price, 369);
  assert.equal(dress.reference, 'VLT GEI012CT');
  for (const slug of ['bebe-meninas-vestido', 'vestidos-bebe']) {
    assert.equal(navigation.matchesCatalogCategory(dress, slug), true);
    assert.deepEqual(Array.from(navigation.productForCategory(dress, slug).sizes), ['2A']);
  }
  for (const slug of ['crianca-meninas-vestido', 'vestidos-crianca']) {
    assert.equal(navigation.matchesCatalogCategory(dress, slug), true);
    assert.deepEqual(Array.from(navigation.productForCategory(dress, slug).sizes), ['2A','4A','6A','8A','10A','12A']);
  }
  for (const slug of ['bebe-meninos', 'crianca-meninos']) assert.equal(navigation.matchesCatalogCategory(dress, slug), false);
});
