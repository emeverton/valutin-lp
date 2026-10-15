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
    'vestido-algodao-bordado', 'vestido-bordado-azul-claro', 'vestido-bordado-creme', 'vestido-bordado-listrado-azul', 'vestido-bordado-rosa', 'vestido-bordado-verde',
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
  assert.ok(navigation.departments.find(department => department.slug === 'bebe').links.includes('vestidos-bebe'));
  const menus = {};
  vm.runInNewContext(ts.transpileModule(read('app/lib/mega-menu.ts'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports: menus, require: name => {
    assert.equal(name, './catalog-navigation');
    return navigation;
  } });
  assert.ok(menus.megaMenuSections.find(section => section.key === 'bebe').columns.flatMap(column => column.links)
    .some(link => link.label === 'Vestidos' && link.href === '/catalogo/categoria/vestidos-bebe'));
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
