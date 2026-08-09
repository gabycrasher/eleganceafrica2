const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const pages = ['index.html', 'shop.html', 'product.html', 'about.html', 'delivery-faq.html', 'contact.html', 'policies.html'];
const styles = fs.readFileSync('assets/css/styles.css', 'utf8');
const main = fs.readFileSync('assets/js/main.js', 'utf8');

function relativeLuminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((channel) => parseInt(channel, 16) / 255);
  const linear = channels.map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function contrastRatio(first, second) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

test('shared interactive colors meet contrast requirements', () => {
  const whatsappGreen = '#176d3e';
  const white = '#ffffff';
  const ink = '#0b0a09';
  const paper = '#fffdf8';
  const gold = '#c49a55';
  const goldLight = '#e2c590';

  assert.match(styles, /\.whatsapp-float\s*\{[^}]*background:\s*#176d3e;/s);
  assert.ok(contrastRatio(white, whatsappGreen) >= 4.5, 'WhatsApp label contrast must meet normal-text AA');
  assert.match(styles, /:focus-visible\s*\{\s*outline:\s*3px solid var\(--ink\);/);
  assert.ok(contrastRatio(ink, paper) >= 3, 'default focus outline must contrast with paper');
  assert.ok(contrastRatio(ink, gold) >= 3, 'default focus outline must contrast with gold CTAs');
  assert.match(styles, /\.dark-section :focus-visible,\s*\.site-footer :focus-visible\s*\{\s*outline-color:\s*var\(--gold-light\);/);
  assert.ok(contrastRatio(goldLight, ink) >= 3, 'dark-surface focus outline must contrast with ink');
});

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
    assert.match(html, /meta name="theme-color" content="#0b0a09"/);
    assert.match(html, /meta name="description"/);
    assert.match(html, /rel="icon" href="assets\/images\/favicon\.svg" type="image\/svg\+xml"/);
    assert.match(html, /fonts\.googleapis\.com/);
    assert.match(html, /fonts\.gstatic\.com/);
    assert.match(html, /integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8\+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"/);
    assert.match(html, /bootstrap\.bundle\.min\.js/);
    assert.match(html, /navbar-expand-lg/);
    assert.match(html, /offcanvas/);
    assert.match(html, /brand-logo/);
    assert.match(html, /Explore hair/);
    assert.match(html, /\+256 765 897 583/);
    assert.match(html, /eeleganceafrica@gmail\.com/);
    const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] || '';
    for (const requiredHref of ['index.html', 'shop.html', 'product.html', 'about.html', 'delivery-faq.html', 'contact.html', 'policies.html', 'policies.html#privacy', 'policies.html#terms', 'policies.html#returns', 'policies.html#shipping']) {
      assert.match(footer, new RegExp(`href="${requiredHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), `${page} footer must link to ${requiredHref}`);
    }
  });
}

test('product cards are visible after initial and filtered catalogue rendering', () => {
  assert.doesNotMatch(main, /function productCardMarkup[\s\S]*?data-reveal/);
  assert.match(styles, /\.js-ready \[data-reveal\]\s*\{\s*opacity:\s*0/);
  assert.match(main, /document\.documentElement\.classList\.add\('js-ready'\)/);
  assert.match(main, /renderCatalog\(control\.dataset\.filter\)/);
});

test('FAQ uses the Bootstrap runtime and accessible accordion states', () => {
  const html = fs.readFileSync('delivery-faq.html', 'utf8');
  assert.match(html, /bootstrap\.bundle\.min\.js/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-controls="faq[1-8]"/);
  assert.match(html, /data-bs-parent="#eleganceFaq"/);
  assert.match(html, /accordion-collapse/);
  assert.match(html, /accordion-body/);
});

test('site includes share metadata and a branded 404 page', () => {
  const home = fs.readFileSync('index.html', 'utf8');
  const notFound = fs.readFileSync('404.html', 'utf8');
  for (const value of ['rel="icon"', 'property="og:title"', 'property="og:image"', 'name="twitter:card"', 'rel="preload"']) assert.match(home, new RegExp(value));
  assert.match(notFound, /Page not found/i);
  assert.match(notFound, /shop\.html/);
});

test('product page has a structured-data hook', () => {
  const html = fs.readFileSync('product.html', 'utf8');
  assert.match(html, /data-product-schema/);
});
