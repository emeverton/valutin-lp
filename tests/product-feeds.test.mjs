import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = readFileSync(new URL('../app/lib/catalog/product-feeds.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function fixture({ configured = true, stock = { status: 'available', quantity: 3 }, catalog: catalogOverride, individualHandles, referenceSkus = ['12345'] } = {}) {
  const exports = {};
  const catalog = catalogOverride || [{
    title: 'Vestido QA', handle: 'vestido-qa', category: 'crianca', catalogCategory: 'vestidos',
    description: 'Algodão.', price: 199.9, sizes: ['4A'], displayImages: ['/catalog/vestido-qa.webp', '/catalog/vestido-qa-2.webp'],
    linxSkus: { '4A': '12345' },
  }];
  const modules = {
    '../catalog.json': { __esModule: true, default: catalog },
    '../catalog-individual': { catalogProducts: (individualHandles || catalog.map((product) => product.handle)).map((handle) => ({ handle })) },
    '../linx/stock': { hasLinxStockConfig: () => configured, getLinxStock: async () => ({ ...stock, skuCount: 1, scope: 'sku' }), getLinxSkusForReference: async () => referenceSkus },
    './feed-id': { catalogFeedId: (sku) => `vlt_${sku}` },
  };
  vm.runInNewContext(compiled, { exports, require: (name) => modules[name], process: { env: { CATALOG_PUBLIC_ORIGIN: 'https://www.valutin.com.br' } }, URL, Promise, Array, Object, String, Number, Error, Math });
  return exports;
}

test('product feed only uses mapped Linx variants and supplies stable platform fields', async () => {
  const feed = fixture();
  const items = await feed.buildProductFeed();
  assert.deepEqual(JSON.parse(JSON.stringify(items)), [{
    id: 'vlt_12345', itemGroupId: 'vlt_vestido-qa', title: 'Vestido QA — 4A', description: 'Algodão.',
    link: 'https://www.valutin.com.br/catalogo/vestido-qa?sku=12345', imageLink: 'https://www.valutin.com.br/catalog/vestido-qa.webp',
    additionalImageLinks: ['https://www.valutin.com.br/catalog/vestido-qa-2.webp'], availability: 'in_stock', inventory: 3, price: 199.9, sku: '12345', size: '4A', productType: 'Valutin > Crianças > vestidos',
  }]);
  assert.match(feed.googleShoppingXml(items), /<g:availability>in_stock<\/g:availability>/);
  assert.match(feed.metaCatalogXml(items), /<g:availability>in stock<\/g:availability>/);
  assert.match(feed.googleShoppingXml(items), /<g:price>199\.90 BRL<\/g:price>/);
});

test('a Linx reference can supply its campaign SKUs without a hardcoded size map', async () => {
  const feed = fixture({ catalog: [{
    title: 'Body QA', handle: 'body-qa', category: 'bebe', description: 'Linho.', price: 149, reference: 'REF QA', sizes: ['6M'], displayImages: ['/catalog/body-qa.webp'],
  }], referenceSkus: ['45678', '45679'] });
  const items = await feed.buildProductFeed();
  assert.deepEqual(items.map((item) => item.id), ['vlt_45678', 'vlt_45679']);
  assert.ok(items.every((item) => item.itemGroupId === 'vlt_body-qa' && item.availability === 'in_stock'));
});

test('feed refuses to publish when Linx stock is not configured', async () => {
  const feed = fixture({ configured: false });
  await assert.rejects(() => feed.buildProductFeed(), (error) => error.code === 'linx_not_configured');
});

test('feed excludes a family handle whose products only have individual PDPs', async () => {
  const catalog = [
    { title: 'Vestido com cores', handle: 'vestido-cores', category: 'crianca', description: 'Laise.', price: 199, sizes: ['4A'], displayImages: ['/catalog/vestido.webp'], linxSku: '12345' },
    { title: 'Body individual', handle: 'body-individual', category: 'bebe', description: 'Linho.', price: 149, sizes: ['6M'], displayImages: ['/catalog/body.webp'], linxSku: '45678' },
  ];
  const feed = fixture({ catalog, individualHandles: ['vestido-cores-rosa', 'vestido-cores-azul', 'body-individual'] });
  const items = await feed.buildProductFeed();
  assert.deepEqual(items.map((item) => item.link), ['https://www.valutin.com.br/catalogo/body-individual?sku=45678']);
});
