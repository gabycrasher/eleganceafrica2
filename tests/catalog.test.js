const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const catalog = require('../assets/js/products.js');

test('catalog exposes six enquiry-only hair products', () => {
  assert.equal(catalog.products.length, 6);
  assert.equal(new Set(catalog.products.map((product) => product.id)).size, 6);
  for (const product of catalog.products) {
    assert.equal(product.price, 'Price on request');
    assert.equal(product.category, 'Hair');
    assert.ok(product.images.length >= 3);
    assert.ok(product.tags.length >= 1);
    for (const image of product.images) {
      assert.equal(fs.existsSync(path.join(__dirname, '..', image)), true, image);
    }
  }
});

test('catalog filters and finds products deterministically', () => {
  assert.equal(catalog.filterProducts('all').length, 6);
  assert.ok(catalog.filterProducts('curly').every((item) => item.tags.includes('curly')));
  assert.equal(catalog.getProductById('aya-bob').name, 'The Aya Bob');
  assert.equal(catalog.getProductById('not-a-product'), undefined);
});

test('WhatsApp enquiry targets the approved business number', () => {
  const url = new URL(catalog.buildWhatsAppUrl('The Aya Bob'));
  assert.equal(url.origin + url.pathname, 'https://wa.me/256765897583');
  assert.match(url.searchParams.get('text'), /The Aya Bob/);
  assert.match(url.searchParams.get('text'), /available options and price/i);
});
