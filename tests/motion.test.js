const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const home = fs.readFileSync('index.html', 'utf8');
const product = fs.readFileSync('product.html', 'utf8');
const script = fs.readFileSync('assets/js/main.js', 'utf8');
const css = fs.readFileSync('assets/css/styles.css', 'utf8');

test('homepage exposes premium motion and inspiration hooks', () => {
  for (const hook of ['data-page-loader', 'data-scroll-progress', 'data-inspiration-rail', 'data-inspiration-track', 'data-rail-prev', 'data-rail-next']) {
    assert.match(home, new RegExp(hook));
  }
});

test('product journeys expose recently viewed hooks', () => {
  assert.match(product, /data-recently-viewed/);
  assert.match(script, /initRecentlyViewed/);
  assert.match(script, /localStorage/);
});

test('motion system honors reduced motion and includes interactive polish', () => {
  for (const selector of ['page-loader', 'scroll-progress', 'inspiration-rail', 'whatsapp-float', 'motion-safe']) {
    assert.match(css, new RegExp(selector));
  }
  assert.match(css, /prefers-reduced-motion/);
});
