const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Contact page uses the approved online contact details and honest form behaviour', () => {
  const html = fs.readFileSync('contact.html', 'utf8');
  assert.match(html, /\+256 765 897 583/); assert.match(html, /eeleganceafrica@gmail\.com/); assert.match(html, /data-contact-form/); assert.match(html, /opens your email application/i);
  assert.doesNotMatch(html, /our location|visit us|opening hours/i);
});

test('Policies page provides all four caveated starter sections', () => {
  const html = fs.readFileSync('policies.html', 'utf8');
  for (const id of ['privacy', 'terms', 'returns', 'shipping']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /Final commercial terms are confirmed by Elegance Africa/i);
  assert.doesNotMatch(html, /non-refundable|delivery within \d|refund within \d/i);
});
