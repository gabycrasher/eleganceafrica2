const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const pages = ['index.html', 'shop.html', 'product.html', 'about.html', 'delivery-faq.html', 'contact.html', 'policies.html'];
const styles = fs.readFileSync('assets/css/styles.css', 'utf8');

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
  });
}
