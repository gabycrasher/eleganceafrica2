const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('About page expresses the approved identity without a physical location', () => {
  const html = fs.readFileSync('about.html', 'utf8');
  for (const phrase of ['Our story', 'Our vision', 'Modern African femininity', 'Quality before quantity', 'More than a brand. A signature.']) assert.match(html, new RegExp(phrase, 'i'));
  assert.doesNotMatch(html, /street address|visit our store|find our shop/i);
});

test('Delivery and FAQ page avoids unconfirmed promises', () => {
  const html = fs.readFileSync('delivery-faq.html', 'utf8');
  assert.match(html, /Kampala/); assert.match(html, /across Uganda/); assert.match(html, /international and African delivery/i); assert.match(html, /confirmed before payment/i); assert.match(html, /id="eleganceFaq"/);
  assert.doesNotMatch(html, /same-day|next-day|free delivery|UGX\s*\d/i);
});
