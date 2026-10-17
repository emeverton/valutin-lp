import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const source = JSON.parse(read('app/lib/catalog.json'));
function compile(path, modules = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, { exports, require: name => { assert.ok(name in modules, name); return modules[name]; } });
  return exports;
}
const nav = compile('app/lib/catalog-navigation.ts');
const { catalogProducts: products } = compile('app/lib/catalog-individual.ts', { './catalog.json': source });
const plain = value => JSON.parse(JSON.stringify(value));

test('baby opens two selections with the exact garment categories and cardigans in both', () => {
  assert.deepEqual(plain(nav.departments.find(item => item.slug === 'bebe').links), ['bebe-meninos', 'bebe-meninas']);
  for (const [section, labels] of [
    ['bebe-meninos', ['Body', 'Macacão', 'Jardineira', 'Conjunto', 'Shorts e Bermuda', 'Cardigans']],
    ['bebe-meninas', ['Body', 'Macacão', 'Jardineira', 'Conjunto', 'Vestido', 'Bloomer', 'Cardigans']],
  ]) {
    assert.deepEqual(plain(nav.babyCategories.filter(item => item.parent === section).map(item => item.label)), labels);
    assert.equal(nav.isCatalogCategory(section), true);
  }
  const menu = compile('app/lib/mega-menu.ts', { './catalog-navigation': nav }).megaMenuSections.find(item => item.key === 'bebe');
  assert.deepEqual(plain(menu.columns.slice(0, 2).map(column => column.title)), ['Meninos', 'Meninas']);
  for (const category of nav.babyCategories) {
    assert.equal(nav.isCatalogCategory(category.slug), true);
    assert.ok(menu.columns.flatMap(column => column.links).some(link => link.href === nav.categoryHref(category.slug)));
  }
});

test('every existing baby color and print is assigned to a garment and at least one selection', () => {
  const babies = products.filter(product => product.category === 'bebe' || product.additionalDepartments?.includes('bebe'));
  assert.ok(babies.length > 30);
  for (const product of babies) {
    const classification = nav.babyClassification(product);
    assert.ok(classification, product.handle);
    const destinations = nav.babyCategories.filter(category => nav.matchesCatalogCategory(product, category.slug));
    assert.equal(destinations.length, classification.audiences.length, product.handle);
    assert.ok(destinations.every(category => category.type === classification.type), product.handle);
  }
  for (const product of products.filter(product => product.category !== 'bebe' && !product.additionalDepartments?.includes('bebe'))) {
    assert.ok(nav.babySections.every(section => !nav.matchesCatalogCategory(product, section.slug)), product.handle);
  }
});

test('unisex items appear in both selections without adding or changing product records', () => {
  const snapshot = JSON.stringify(products);
  for (const handle of ['conjunto-camisa-shorts-verde', 'conjunto-camisa-shorts-azul', 'jardineira-ursos']) {
    const product = products.find(item => item.handle === handle);
    assert.ok(product, handle);
    for (const section of nav.babySections) assert.equal(nav.matchesCatalogCategory(product, section.slug), true, handle);
    assert.equal(products.filter(item => item.handle === handle).length, 1);
  }
  assert.equal(JSON.stringify(products), snapshot);
});

test('body, outfit, romper and dungaree results remain separate regardless of the old combined category', () => {
  for (const [handle, category, excluded] of [
    ['body-linho', 'bebe-meninos-body', 'bebe-meninos-conjunto'],
    ['conjunto-body-shorts-xadrez-azul', 'bebe-meninas-conjunto', 'bebe-meninas-body'],
    ['macacao-fustao-azul', 'bebe-meninas-jardineira', 'bebe-meninas-macacao'],
    ['macacao-fustao-floral-rosa', 'bebe-meninas-macacao', 'bebe-meninas-jardineira'],
    ['shorts-algodao-rosa', 'bebe-meninos-shorts-e-bermuda', 'bebe-meninas-bloomer'],
    ['bloomer-fustao', 'bebe-meninas-bloomer', 'bebe-meninos-shorts-e-bermuda'],
  ]) {
    const product = products.find(item => item.handle === handle);
    assert.ok(product, handle);
    assert.equal(nav.matchesCatalogCategory(product, category), true, handle);
    assert.equal(nav.matchesCatalogCategory(product, excluded), false, handle);
  }
});

test('girls dresses and decorative cardigans do not leak into boys categories based on blue color', () => {
  for (const handle of ['vestido-bebe-bordado-azul-kds005ct', 'cardigan-linha-azul-vlt-ver027ct', 'cardigan-bordado-mao-bordado-azul']) {
    const product = products.find(item => item.handle === handle);
    assert.equal(nav.matchesCatalogCategory(product, 'bebe-meninas'), true, handle);
    assert.equal(nav.matchesCatalogCategory(product, 'bebe-meninos'), false, handle);
  }
  assert.equal(nav.matchesCatalogCategory(products.find(item => item.handle === 'cardigan-bebe-carrinho'), 'bebe-meninos-cardigans'), true);
});

test('requested baby pieces appear only in their assigned selection', () => {
  for (const [handles, audience, type] of [
    [['body-linho'], 'meninos', 'body'],
    [['macacao-tricoline-listra-vermelha', 'macacao-tricoline-listra-sage', 'macacao-tricoline-ursos'], 'meninos', 'macacao'],
    [['macacao-bordado-elefante', 'macacao-bordado-coelho'], 'meninas', 'macacao'],
  ]) {
    for (const handle of handles) {
      const product = products.find(item => item.handle === handle);
      assert.ok(product, handle);
      const other = audience === 'meninos' ? 'meninas' : 'meninos';
      assert.equal(nav.matchesCatalogCategory(product, `bebe-${audience}`), true, handle);
      assert.equal(nav.matchesCatalogCategory(product, `bebe-${audience}-${type}`), true, handle);
      assert.equal(nav.matchesCatalogCategory(product, `bebe-${other}`), false, handle);
      assert.equal(nav.matchesCatalogCategory(product, `bebe-${other}-${type}`), false, handle);
    }
  }
});

test('product breadcrumbs reject unrelated query context', () => {
  const body = products.find(item => item.handle === 'body-linho');
  assert.deepEqual(plain(nav.productCategoryTrail(body, 'bebe-meninas-body').map(item => item.slug)), ['bebe', 'bebe-meninos', 'bebe-meninos-body']);
  assert.deepEqual(plain(nav.productCategoryTrail(body, 'bebe-meninos-body').map(item => item.slug)), ['bebe', 'bebe-meninos', 'bebe-meninos-body']);
  assert.equal(nav.productCategoryTrail(body, 'bebe-meninas-vestido').at(-1).slug, 'bebe-meninos-body');
  assert.deepEqual(plain(nav.categoryAncestors('bebe-meninas-vestido')), ['bebe', 'bebe-meninas']);
});

test('VLT MAR060BB has two separate boys body cards with the supplied price and photos', () => {
  const bodies = products.filter(product => product.reference === 'VLT MAR060BB');
  assert.equal(bodies.length, 2);
  assert.equal(new Set(bodies.flatMap(product => product.images)).size, 2);
  for (const product of bodies) {
    assert.equal(product.price, 108);
    assert.deepEqual(plain(product.sizes), ['3M', '6M', '9M', '12M', '18M', '2A']);
    assert.equal(nav.matchesCatalogCategory(product, 'bebe-meninos-body'), true);
    assert.equal(nav.matchesCatalogCategory(product, 'bebe-meninas'), false);
    assert.equal(nav.matchesCatalogCategory(product, 'crianca'), false);
    assert.equal(product.stock, undefined);
    assert.equal(product.linxSku, undefined);
    assert.deepEqual(plain(product.images), plain(product.displayImages));
    assert.equal(nav.productCategoryTrail(product).at(-1).slug, 'bebe-meninos-body');
  }
});

test('PV26/27GE009BB has three distinct cargo dungarees only in boys dungarees', () => {
  const pieces = products.filter(product => product.reference === 'PV26/27GE009BB');
  assert.equal(pieces.length, 3);
  assert.equal(new Set(pieces.flatMap(product => product.images)).size, 3);
  for (const product of pieces) {
    assert.equal(product.price, 228);
    assert.deepEqual(plain(product.sizes), ['6M', '9M', '12M', '18M', '2A']);
    assert.equal(nav.matchesCatalogCategory(product, 'bebe-meninos-jardineira'), true);
    for (const slug of ['bebe-meninas', 'bebe-meninos-macacao', 'crianca']) assert.equal(nav.matchesCatalogCategory(product, slug), false, slug);
    assert.equal(nav.productCategoryTrail(product).at(-1).slug, 'bebe-meninos-jardineira');
    assert.equal(product.stock, undefined);
    assert.equal(product.linxSku, undefined);
  }
});

test('VLT MAR120BB has five distinct prints only in girls bodies with the supplied price and sizes', () => {
  const pieces = products.filter(product => product.reference === 'VLT MAR120BB');
  assert.equal(pieces.length, 5);
  assert.equal(new Set(pieces.flatMap(product => product.images)).size, 5);
  for (const product of pieces) {
    assert.equal(product.price, 128);
    assert.deepEqual(plain(product.sizes), ['3M', '6M', '9M', '12M', '18M', '2A']);
    assert.equal(nav.matchesCatalogCategory(product, 'bebe-meninas-body'), true);
    for (const slug of ['bebe-meninos', 'bebe-meninas-conjunto', 'crianca']) assert.equal(nav.matchesCatalogCategory(product, slug), false, slug);
    assert.equal(nav.productCategoryTrail(product).at(-1).slug, 'bebe-meninas-body');
    assert.equal(product.stock, undefined);
    assert.equal(product.linxSku, undefined);
    assert.deepEqual(plain(product.images), plain(product.displayImages));
  }
});

test('VLT PF004BB appears once in the catalog and in both baby romper selections', () => {
  const pieces = products.filter(product => product.reference === 'VLT PF004BB');
  assert.equal(pieces.length, 1);
  const product = pieces[0];
  assert.equal(product.price, 338);
  for (const audience of ['meninos', 'meninas']) {
    const slug = `bebe-${audience}-macacao`;
    assert.equal(nav.matchesCatalogCategory(product, slug), true);
    assert.equal(nav.productCategoryTrail(product, slug).at(-1).slug, slug);
    assert.equal(nav.matchesCatalogCategory(product, `bebe-${audience}-jardineira`), false);
  }
  assert.equal(nav.matchesCatalogCategory(product, 'crianca'), false);
  assert.equal(product.stock, undefined);
  assert.equal(product.linxSku, undefined);
});
