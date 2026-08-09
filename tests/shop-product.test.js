const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Shop exposes all approved filters and catalogue states', () => {
  const html = fs.readFileSync('shop.html', 'utf8');
  for (const tag of ['all', 'curly', 'straight', 'wavy', 'bob', 'statement']) assert.match(html, new RegExp(`data-filter="${tag}"`));
  assert.match(html, /data-product-grid/); assert.match(html, /data-empty-state/);
  assert.match(html, /Fragrance/); assert.match(html, /Beauty/); assert.match(html, /Accessories/); assert.match(html, /Expanding soon/);
  assert.match(html, /<noscript>[\s\S]*?<\/noscript>/);
  for (const id of ['amara-coil', 'zuri-straight', 'nia-wave', 'imani-crop', 'sanaa-burgundy', 'aya-bob']) {
    assert.match(html, new RegExp(`product\\.html\\?id=${id}`));
  }
});

test('Product page exposes reusable gallery, facts, CTA, and fallback hooks', () => {
  const html = fs.readFileSync('product.html', 'utf8');
  for (const hook of ['data-product-view', 'data-product-not-found', 'data-gallery-main', 'data-gallery-thumbs', 'data-product-name', 'data-product-price', 'data-product-description', 'data-product-availability', 'data-product-care', 'data-product-whatsapp', 'data-related-grid']) assert.match(html, new RegExp(hook));
  assert.match(html, /Available options are confirmed personally/);
});

test('product page exposes selector and styling hooks', () => {
  const html = fs.readFileSync('product.html', 'utf8');
  for (const hook of ['data-product-length', 'data-product-density', 'data-product-style']) assert.match(html, new RegExp(hook));
});

test('product page behavior uses active-product options and refreshes its enquiry URL', () => {
  const script = fs.readFileSync('assets/js/main.js', 'utf8');
  assert.match(script, /product\.wearItHow/);
  assert.match(script, /product\.lengths\.map/);
  assert.match(script, /product\.densities\.map/);
  assert.match(script, /length\.addEventListener\('change', updateEnquiry\)/);
  assert.match(script, /density\.addEventListener\('change', updateEnquiry\)/);
});
