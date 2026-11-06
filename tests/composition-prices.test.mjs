import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const exports = {};
const source = readFileSync(new URL('../app/components/CompositionPrices.tsx', import.meta.url), 'utf8');
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText, { exports, require, Intl });

test('composition preserves the known price and shows an unpriced body as consultation rather than zero', () => {
  const products = JSON.parse(readFileSync(new URL('../app/lib/catalog.json', import.meta.url), 'utf8'));
  const product = products.find(item => item.handle === 'composicao-querubim-branco-body');
  assert.deepEqual(product.componentPrices.map(item => item.sizes), [['RN', '3M'], ['RN', '3M']]);
  assert.equal(product.componentPrices[0].price, 378);
  assert.equal(product.componentPrices[1].price, null);
  assert.equal(product.componentPrices[1].reference, null);
  const html = renderToStaticMarkup(React.createElement(exports.default, { items: product.componentPrices }));
  assert.match(html, /378,00/);
  assert.match(html, /Sob consulta/);
  assert.doesNotMatch(html, /R\$\s*0,00|null|undefined/);
});
