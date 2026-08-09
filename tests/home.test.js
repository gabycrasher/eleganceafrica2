const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');

test('homepage carries the approved brand message and conversion actions', () => {
  assert.match(html, /More than a brand\. A signature\./);
  assert.match(html, /Discover Your Signature/);
  assert.match(html, /href="shop\.html"/);
  assert.match(html, /href="about\.html"/);
});

test('homepage contains the complete editorial journey', () => {
  for (const id of ['new-arrivals', 'categories', 'story', 'why', 'experience', 'find-signature', 'reviews', 'social', 'community']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /data-featured-grid/);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /Newsletter integration is being prepared/);
  assert.match(html, /<noscript>[\s\S]*?product\.html\?id=amara-coil[\s\S]*?Price on request[\s\S]*?<\/noscript>/);
});

test('homepage contains an interactive signature quiz', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  for (const hook of ['data-signature-quiz', 'data-quiz-step', 'data-quiz-result']) assert.match(html, new RegExp(hook));
  assert.match(html, /Hair texture/i); assert.match(html, /Occasion/i); assert.match(html, /Style preference/i);
});

test('signature quiz moves focus into the revealed step', () => {
  const script = fs.readFileSync('assets/js/main.js', 'utf8');
  assert.match(script, /function showStep[\s\S]*?legend\.focus\(\)/);
});
