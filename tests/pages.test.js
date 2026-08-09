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
  for (const value of ['<html lang="en">', 'rel="icon" href="assets/images/favicon.svg"', 'id="site-header"', 'id="main-content"', 'site-footer', 'wa\.me/256765897583']) assert.match(notFound, new RegExp(value));
});

test('general pages publish complete default sharing metadata', () => {
  const generalPages = ['shop.html', 'about.html', 'contact.html', 'delivery-faq.html', 'policies.html', '404.html'];
  for (const page of generalPages) {
    const html = fs.readFileSync(page, 'utf8');
    assert.match(html, /<meta property="og:title" content="[^"]+">/, `${page} needs an Open Graph title`);
    assert.match(html, /<meta property="og:description" content="[^"]+">/, `${page} needs an Open Graph description`);
    assert.match(html, /<meta property="og:image" content="assets\/images\/[^"]+">/, `${page} needs a default sharing image`);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/, `${page} needs a Twitter card type`);
  }
});

test('product page has a structured-data hook', () => {
  const html = fs.readFileSync('product.html', 'utf8');
  assert.match(html, /data-product-schema/);
});

test('static product pages expose product-specific sharing metadata without offers', () => {
  const products = [
    ['amara-coil', 'The Amara Coil', 'amara-coil-1.jpeg'], ['zuri-straight', 'The Zuri Straight', 'zuri-straight-1.jpeg'], ['nia-wave', 'The Nia Wave', 'nia-wave-1.jpeg'],
    ['imani-crop', 'The Imani Crop', 'imani-crop-1.jpeg'], ['sanaa-burgundy', 'The Sanaa Burgundy', 'sanaa-burgundy-1.jpeg'], ['aya-bob', 'The Aya Bob', 'aya-bob-1.jpeg']
  ];
  for (const [id, name, image] of products) {
    const html = fs.readFileSync(`products/${id}.html`, 'utf8');
    assert.match(html, new RegExp(`<title>${name} \\| Elegance Africa</title>`));
    assert.match(html, /name="description"/); assert.match(html, /property="og:title"/); assert.match(html, /property="og:description"/); assert.match(html, /property="og:image"/); assert.match(html, /name="twitter:title"/); assert.match(html, /name="twitter:image"/);
    assert.match(html, new RegExp(`href="\.\.\/products/${id}\\.html"`)); assert.match(html, new RegExp(`\.\.\/assets\/images\/${image}`)); assert.match(html, /"@type":"Product"/); assert.match(html, /"@type":"Organization"/); assert.doesNotMatch(html, /"price"\s*:/); assert.doesNotMatch(html, /"@type":"Offer"/);
    assert.match(html, /bootstrap@5\.3\.8/); assert.match(html, /fonts\.googleapis\.com/); assert.match(html, /fonts\.gstatic\.com/);
  }
});

test('static product journeys expose product-specific guidance and optional enquiry selections', () => {
  const products = [
    ['amara-coil', 'The Amara Coil', 'Wear it with a simple neckline when you want a textured look to carry the occasion.'],
    ['zuri-straight', 'The Zuri Straight', 'Wear it sleek for polished daytime plans or a refined evening entrance.'],
    ['nia-wave', 'The Nia Wave', 'Wear it for an evening occasion with soft makeup and a clean, understated neckline.'],
    ['imani-crop', 'The Imani Crop', 'Wear it with sculptural earrings when you want the short silhouette to frame your face.'],
    ['sanaa-burgundy', 'The Sanaa Burgundy', 'Wear it for a bold occasion with a neutral outfit that lets the burgundy tone take focus.'],
    ['aya-bob', 'The Aya Bob', 'Wear it with a tailored look for a confident occasion that calls for a clean silhouette.']
  ];

  for (const [id, name, guidance] of products) {
    const html = fs.readFileSync(`products/${id}.html`, 'utf8');
    assert.match(html, new RegExp(`data-product-id="${id}"`));
    assert.ok(html.includes(guidance), `${id} needs its own wear-it-how guidance`);
    assert.match(html, /data-product-length[\s\S]*?<option value="">Not selected<\/option>/);
    assert.match(html, /data-product-density[\s\S]*?<option value="">Not selected<\/option>/);
    assert.match(html, /data-static-product-whatsapp/);
    const enquiry = html.match(/data-static-product-whatsapp[^>]*href="([^"]+)"/)?.[1] || html.match(/href="([^"]+)"[^>]*data-static-product-whatsapp/)?.[1] || '';
    assert.match(enquiry, /^https:\/\/wa\.me\/256765897583\?text=/);
    assert.match(decodeURIComponent(enquiry), new RegExp(name));
    assert.match(html, /\.\.\/assets\/js\/products\.js/);
    assert.match(html, /\.\.\/assets\/js\/main\.js/);
  }
});
