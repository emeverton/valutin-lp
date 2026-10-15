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
