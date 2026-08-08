const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const pages = ['index.html', 'shop.html', 'product.html', 'about.html', 'delivery-faq.html', 'contact.html', 'policies.html'];

for (const page of pages) {
  test(`${page} includes the accessible shared shell`, () => {
    const html = fs.readFileSync(page, 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.match(html, /name="viewport"/);
    assert.match(html, /bootstrap@5\.3\.8/);
    assert.match(html, /bootstrap-icons@1\.13\.1/);
    assert.match(html, /assets\/css\/styles\.css/);
    assert.match(html, /id="site-header"/);
    assert.match(html, /id="main-content"/);
    assert.match(html, /class="[^"]*site-footer/);
    assert.match(html, /aria-label="Chat with Elegance Africa on WhatsApp"/);
    assert.match(html, /assets\/js\/products\.js/);
    assert.match(html, /assets\/js\/main\.js/);
  });
}
