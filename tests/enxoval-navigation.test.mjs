import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
function compile(path, modules = {}) {
  const exports = {};
  const source = readFileSync(new URL(`../app/lib/${path}.ts`, import.meta.url), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports, require: name => { assert.ok(name in modules, name); return modules[name]; },
  });
  return exports;
}
const nav = compile('catalog-navigation');
const menu = compile('mega-menu', { './catalog-navigation': nav });

test('Enxoval connects the main menu, five categories and their return paths', () => {
  const department = nav.departments.find(item => item.slug === 'enxoval');
  assert.equal(nav.departments[1].slug, 'enxoval');
  const categories = nav.departmentCategories.filter(item => item.department === 'enxoval');
  assert.equal(categories.length, 5);
  assert.deepEqual(Array.from(department.links), Array.from(categories, item => item.slug));
  const links = menu.megaMenuSections.find(item => item.key === 'enxoval').columns.flatMap(column => column.links);
  for (const category of categories) {
    assert.match(category.slug, /^[a-z0-9-]+$/);
    assert.equal(nav.isCatalogCategory(category.slug), true);
    assert.deepEqual(Array.from(nav.categoryAncestors(category.slug)), ['enxoval']);
    assert.ok(links.some(link => link.href === nav.categoryHref(category.slug)));
    const piece = { category: 'enxoval', catalogCategory: category.catalogCategory };
    assert.equal(nav.matchesCatalogCategory(piece, 'enxoval'), true);
    for (const other of categories) assert.equal(nav.matchesCatalogCategory(piece, other.slug), category === other);
    assert.equal(nav.matchesCatalogCategory({ ...piece, category: 'maternidade' }, category.slug), false);
  }
});

test('children bath items share Enxoval without duplication or gender assignment', () => {
  const sections = nav.catalogSubcategories.filter(item => item.parent === 'banho-crianca');
  assert.deepEqual(Array.from(sections, item => item.label), ['Toalhas', 'Roupões']);
  assert.equal(nav.isCatalogCategory('banho-crianca'), true);
  assert.deepEqual(Array.from(nav.categoryAncestors('banho-crianca')), ['crianca']);
  const bathLink = menu.megaMenuSections.find(item => item.key === 'crianca').columns.flatMap(item => item.links).find(item => item.href === nav.categoryHref('banho-crianca'));
  assert.deepEqual(Array.from(bathLink.children, item => item.href), Array.from(sections, item => nav.categoryHref(item.slug)));
  for (const section of sections) {
    const product = { handle: `teste-${section.slug}`, category: 'crianca', catalogCategory: section.slug };
    const snapshot = JSON.stringify(product);
    for (const category of ['crianca', 'banho-crianca', section.slug, 'enxoval', 'toalhas-e-banho']) assert.equal(nav.matchesCatalogCategory(product, category), true, category);
    for (const category of ['crianca-meninos', 'crianca-meninas', 'maternidade', 'bebe', ...sections.filter(item => item !== section).map(item => item.slug)]) assert.equal(nav.matchesCatalogCategory(product, category), false, category);
    assert.deepEqual(Array.from(nav.categoryAncestors(section.slug)), ['crianca', 'banho-crianca']);
    assert.deepEqual(Array.from(nav.productCategoryTrail(product), item => item.slug), ['crianca', 'banho-crianca', section.slug]);
    assert.deepEqual(Array.from(nav.productCategoryTrail(product, 'toalhas-e-banho'), item => item.slug), ['enxoval', 'toalhas-e-banho']);
    assert.equal(JSON.stringify(product), snapshot);
  }
  assert.equal(nav.matchesCatalogCategory({ category: 'batizado', catalogCategory: 'batizado-e-cerimonia', handle: 'toalha-batizado' }, 'toalhas-e-banho'), false);
});
