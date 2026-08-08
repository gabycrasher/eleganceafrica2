# Elegance Africa Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, responsive, multi-page Elegance Africa static catalogue that uses the supplied hair photography and converts product interest into product-specific WhatsApp enquiries.

**Architecture:** Seven semantic HTML pages share one design system, one catalogue module, and one interaction module. Product data is centralized in `assets/js/products.js`; `assets/js/main.js` progressively enhances the Home, Shop, Product, Contact, and newsletter interfaces while every page remains readable without JavaScript.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Bootstrap 5.3.8, Bootstrap Icons 1.13.1, Node.js built-in test runner, local JPEG assets.

## Global Constraints

- Use plain HTML, CSS, JavaScript, and Bootstrap; do not add React, a framework, or a build system.
- Use Bootstrap 5.3.8 from the official jsDelivr URLs with the published integrity hashes.
- Use Bootstrap Icons 1.13.1 from the official jsDelivr URL.
- The business is online-only; do not publish a street address or imply that customers can visit a store.
- Use WhatsApp number `+256 765 897 583`, URL number `256765897583`, and email `eeleganceafrica@gmail.com` exactly.
- Display `Price on request` for every product.
- Do not add cart, checkout, payment processing, confirmed stock, unverified lengths, delivery fees, delivery times, or unconfirmed social URLs.
- Hair is the active catalogue. Fragrance, Beauty, and Accessories are presented as future categories without invented products.
- All product names are explicitly temporary editorial names and must avoid unverified material, origin, density, or length claims.
- Use the supplied local photography and logo; do not generate replacement product imagery.
- Preserve keyboard access, visible focus, useful alternative text, sufficient contrast, and `prefers-reduced-motion` behaviour.
- The completed directory must work through a basic static HTTP server with no compilation.

## File Structure and Responsibilities

| Path | Responsibility |
|---|---|
| `.gitignore` | Ignore the original root-level WhatsApp image filenames after curated copies are added. |
| `index.html` | Editorial homepage and conversion journey. |
| `shop.html` | Filterable hair catalogue and future-category preview. |
| `product.html` | Reusable product-detail view selected with `?id=<product-id>`. |
| `about.html` | Brand story, philosophy, identity, and vision. |
| `delivery-faq.html` | Delivery guidance and Bootstrap FAQ accordion. |
| `contact.html` | Online contact routes and mail-client enquiry form. |
| `policies.html` | Starter Privacy, Terms, Returns, and Shipping sections. |
| `assets/css/styles.css` | Tokens, Bootstrap overrides, page layouts, responsive rules, states, and motion. |
| `assets/js/products.js` | Six-product catalogue and pure filter, lookup, and WhatsApp URL helpers. |
| `assets/js/main.js` | DOM rendering, galleries, filters, forms, navigation state, and reveal effects. |
| `assets/images/*.jpeg` | Curated, web-friendly copies of the supplied logo and product photos. |
| `tests/catalog.test.js` | Catalogue schema and helper behaviour. |
| `tests/pages.test.js` | Shared page shell, metadata, and asset inclusion. |
| `tests/home.test.js` | Homepage content and section coverage. |
| `tests/shop-product.test.js` | Shop and reusable product page hooks. |
| `tests/support-content.test.js` | About and delivery/FAQ accuracy. |
| `tests/contact-policy.test.js` | Contact facts, form disclosure, and policy caveats. |
| `tests/links.test.js` | Local page, stylesheet, script, image, and anchor integrity. |

---

### Task 1: Curate Assets and Establish the Catalogue Contract

**Files:**
- Create: `.gitignore`
- Create: `assets/images/logo.jpeg`
- Create: `assets/images/amara-coil-1.jpeg`
- Create: `assets/images/amara-coil-2.jpeg`
- Create: `assets/images/amara-coil-3.jpeg`
- Create: `assets/images/zuri-straight-1.jpeg`
- Create: `assets/images/zuri-straight-2.jpeg`
- Create: `assets/images/zuri-straight-3.jpeg`
- Create: `assets/images/nia-wave-1.jpeg`
- Create: `assets/images/nia-wave-2.jpeg`
- Create: `assets/images/nia-wave-3.jpeg`
- Create: `assets/images/imani-crop-1.jpeg`
- Create: `assets/images/imani-crop-2.jpeg`
- Create: `assets/images/imani-crop-3.jpeg`
- Create: `assets/images/sanaa-burgundy-1.jpeg`
- Create: `assets/images/sanaa-burgundy-2.jpeg`
- Create: `assets/images/sanaa-burgundy-3.jpeg`
- Create: `assets/images/aya-bob-1.jpeg`
- Create: `assets/images/aya-bob-2.jpeg`
- Create: `assets/images/aya-bob-3.jpeg`
- Create: `assets/images/aya-bob-4.jpeg`
- Create: `assets/js/products.js`
- Create: `tests/catalog.test.js`

**Interfaces:**
- Consumes: the supplied root-level JPEG files.
- Produces: global/CommonJS API `EleganceCatalog` with `products`, `filterProducts(tag)`, `getProductById(id)`, and `buildWhatsAppUrl(productName)`.

- [ ] **Step 1: Write the failing catalogue contract test**

```js
// tests/catalog.test.js
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
```

- [ ] **Step 2: Run the test and confirm the missing module failure**

Run: `node --test tests/catalog.test.js`

Expected: FAIL with `Cannot find module '../assets/js/products.js'`.

- [ ] **Step 3: Copy the curated source images to stable filenames**

```powershell
New-Item -ItemType Directory -Force -Path 'assets/images', 'assets/js', 'tests' | Out-Null
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.43 PM.jpeg' -Destination 'assets/images/logo.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.43 PM (1).jpeg' -Destination 'assets/images/amara-coil-1.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.48 PM (2).jpeg' -Destination 'assets/images/amara-coil-2.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.49 PM (2).jpeg' -Destination 'assets/images/amara-coil-3.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.48 PM.jpeg' -Destination 'assets/images/zuri-straight-1.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.47 PM (2).jpeg' -Destination 'assets/images/zuri-straight-2.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.45 PM.jpeg' -Destination 'assets/images/zuri-straight-3.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.47 PM.jpeg' -Destination 'assets/images/nia-wave-1.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.46 PM (2).jpeg' -Destination 'assets/images/nia-wave-2.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.46 PM (4).jpeg' -Destination 'assets/images/nia-wave-3.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.51 PM (2).jpeg' -Destination 'assets/images/imani-crop-1.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.45 PM (1).jpeg' -Destination 'assets/images/imani-crop-2.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.50 PM (3).jpeg' -Destination 'assets/images/imani-crop-3.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.52 PM.jpeg' -Destination 'assets/images/sanaa-burgundy-1.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.52 PM (1).jpeg' -Destination 'assets/images/sanaa-burgundy-2.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.51 PM (4).jpeg' -Destination 'assets/images/sanaa-burgundy-3.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.53 PM (2).jpeg' -Destination 'assets/images/aya-bob-1.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.54 PM.jpeg' -Destination 'assets/images/aya-bob-2.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.53 PM (3).jpeg' -Destination 'assets/images/aya-bob-3.jpeg'
Copy-Item -LiteralPath 'WhatsApp Image 2026-08-08 at 9.14.49 PM (3).jpeg' -Destination 'assets/images/aya-bob-4.jpeg'
```

Create `.gitignore` with exactly:

```gitignore
/WhatsApp Image*.jpeg
```

- [ ] **Step 4: Implement the catalogue module**

```js
// assets/js/products.js
(function attachCatalog(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.EleganceCatalog = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createCatalog() {
  const products = [
    {
      id: 'amara-coil', name: 'The Amara Coil', category: 'Hair',
      tags: ['curly', 'bob'], featured: true, price: 'Price on request',
      images: ['assets/images/amara-coil-1.jpeg', 'assets/images/amara-coil-2.jpeg', 'assets/images/amara-coil-3.jpeg'],
      description: 'A softly rounded, textured look with natural volume and an expressive silhouette.',
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Detangle gently in sections and ask our team for care guidance suited to your selected piece.'
    },
    {
      id: 'zuri-straight', name: 'The Zuri Straight', category: 'Hair',
      tags: ['straight'], featured: true, price: 'Price on request',
      images: ['assets/images/zuri-straight-1.jpeg', 'assets/images/zuri-straight-2.jpeg', 'assets/images/zuri-straight-3.jpeg'],
      description: 'A polished straight finish with a smooth fall and warm, dimensional colour.',
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Store neatly between wears and use heat only after confirming the right care routine with our team.'
    },
    {
      id: 'nia-wave', name: 'The Nia Wave', category: 'Hair',
      tags: ['wavy'], featured: true, price: 'Price on request',
      images: ['assets/images/nia-wave-1.jpeg', 'assets/images/nia-wave-2.jpeg', 'assets/images/nia-wave-3.jpeg'],
      description: 'A flowing dark wave designed for soft movement, volume, and an elegant finish.',
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Use a wide-tooth comb, begin at the ends, and keep the wave pattern supported between wears.'
    },
    {
      id: 'imani-crop', name: 'The Imani Crop', category: 'Hair',
      tags: ['curly', 'bob'], featured: false, price: 'Price on request',
      images: ['assets/images/imani-crop-1.jpeg', 'assets/images/imani-crop-2.jpeg', 'assets/images/imani-crop-3.jpeg'],
      description: 'A short sculpted curl with lively definition and an effortlessly confident profile.',
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Refresh curls lightly, avoid aggressive brushing, and reshape with your fingers as needed.'
    },
    {
      id: 'sanaa-burgundy', name: 'The Sanaa Burgundy', category: 'Hair',
      tags: ['curly', 'statement'], featured: true, price: 'Price on request',
      images: ['assets/images/sanaa-burgundy-1.jpeg', 'assets/images/sanaa-burgundy-2.jpeg', 'assets/images/sanaa-burgundy-3.jpeg'],
      description: 'A statement curl in a deep burgundy tone, balancing softness with unmistakable presence.',
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Separate curls gently and ask our team about colour-conscious care before using new products.'
    },
    {
      id: 'aya-bob', name: 'The Aya Bob', category: 'Hair',
      tags: ['straight', 'bob', 'statement'], featured: true, price: 'Price on request',
      images: ['assets/images/aya-bob-1.jpeg', 'assets/images/aya-bob-2.jpeg', 'assets/images/aya-bob-3.jpeg', 'assets/images/aya-bob-4.jpeg'],
      description: 'A refined rounded bob with a sleek finish and warm brunette depth.',
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Keep the shape smooth, store on a suitable stand, and confirm styling guidance before applying heat.'
    }
  ];

  function filterProducts(tag = 'all') {
    return tag === 'all' ? [...products] : products.filter((product) => product.tags.includes(tag));
  }

  function getProductById(id) {
    return products.find((product) => product.id === id);
  }

  function buildWhatsAppUrl(productName) {
    const message = `Hello Elegance Africa, I'm interested in ${productName}. Please share the available options and price.`;
    return `https://wa.me/256765897583?text=${encodeURIComponent(message)}`;
  }

  return { products, filterProducts, getProductById, buildWhatsAppUrl };
}));
```

- [ ] **Step 5: Run the catalogue test and confirm it passes**

Run: `node --test tests/catalog.test.js`

Expected: 3 tests pass.

- [ ] **Step 6: Commit the asset and catalogue foundation**

```powershell
git add .gitignore assets/images assets/js/products.js tests/catalog.test.js
git commit -m "feat: add curated Elegance Africa catalogue"
```

---

### Task 2: Build the Shared Page Shell and Design System

**Files:**
- Create: `index.html`
- Create: `shop.html`
- Create: `product.html`
- Create: `about.html`
- Create: `delivery-faq.html`
- Create: `contact.html`
- Create: `policies.html`
- Create: `assets/css/styles.css`
- Create: `assets/js/main.js`
- Create: `tests/pages.test.js`

**Interfaces:**
- Consumes: `assets/images/logo.jpeg` and `EleganceCatalog` from Task 1.
- Produces: shared DOM hooks `#site-header`, `#main-content`, `.site-footer`, `.whatsapp-float`, and global initializer `EleganceSite.init()`.

- [ ] **Step 1: Write the failing shared-shell test**

```js
// tests/pages.test.js
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
```

- [ ] **Step 2: Run the shared-shell test and confirm missing-page failures**

Run: `node --test tests/pages.test.js`

Expected: FAIL with `ENOENT` for `index.html`.

- [ ] **Step 3: Create all seven semantic page shells**

Use this exact document contract on every page, changing only the approved title, description, active navigation item, and `<main>` content:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b0a09">
  <title>Elegance Africa | More Than a Brand. A Signature.</title>
  <meta name="description" content="Discover premium hair and a growing world of beauty, thoughtfully selected for the modern African woman.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body data-page="home">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div class="announcement-bar">Online beauty, thoughtfully selected · Enquiries across Uganda & beyond</div>
  <header id="site-header" class="site-header">
    <nav class="navbar navbar-expand-lg" aria-label="Primary navigation">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.html"><img class="brand-logo" src="assets/images/logo.jpeg" alt="Elegance Africa"><span>Elegance Africa</span></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#siteMenu" aria-controls="siteMenu" aria-label="Open navigation"><span class="navbar-toggler-icon"></span></button>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="siteMenu" aria-labelledby="siteMenuLabel">
          <div class="offcanvas-header"><h2 class="offcanvas-title" id="siteMenuLabel">Elegance Africa</h2><button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close navigation"></button></div>
          <div class="offcanvas-body align-items-center">
            <ul class="navbar-nav ms-auto gap-lg-3">
              <li class="nav-item"><a class="nav-link" data-nav="home" href="index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link" data-nav="shop" href="shop.html">Shop</a></li>
              <li class="nav-item"><a class="nav-link" data-nav="about" href="about.html">Our Story</a></li>
              <li class="nav-item"><a class="nav-link" data-nav="support" href="delivery-faq.html">Delivery &amp; FAQ</a></li>
              <li class="nav-item"><a class="nav-link" data-nav="contact" href="contact.html">Contact</a></li>
            </ul>
            <a class="btn btn-gold ms-lg-4" href="shop.html">Explore hair</a>
          </div>
        </div>
      </div>
    </nav>
  </header>
  <main id="main-content"><section class="page-hero"><div class="container"><p class="eyebrow">Elegance Africa</p><h1 class="display-title">More than a brand.<br>A signature.</h1></div></section></main>
  <footer class="site-footer">
    <div class="container"><div class="row g-5">
      <div class="col-lg-5"><img class="brand-logo mb-3" src="assets/images/logo.jpeg" alt=""><h2 class="display-title">Elegance Africa</h2><p>Beauty, elegance and confidence—thoughtfully selected for the modern African woman.</p></div>
      <div class="col-6 col-lg-2"><h3 class="h6">Explore</h3><ul class="list-unstyled"><li><a href="index.html">Home</a></li><li><a href="shop.html">Shop</a></li><li><a href="about.html">Our Story</a></li><li><a href="delivery-faq.html">Delivery &amp; FAQ</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div class="col-6 col-lg-2"><h3 class="h6">Policies</h3><ul class="list-unstyled"><li><a href="policies.html#privacy">Privacy</a></li><li><a href="policies.html#terms">Terms</a></li><li><a href="policies.html#returns">Returns</a></li><li><a href="policies.html#shipping">Shipping</a></li></ul></div>
      <div class="col-lg-3"><h3 class="h6">Talk to us</h3><p><a href="tel:+256765897583">+256 765 897 583</a><br><a href="mailto:eeleganceafrica@gmail.com">eeleganceafrica@gmail.com</a></p></div>
    </div><hr><p class="small mb-0">© 2026 Elegance Africa. All rights reserved.</p></div>
  </footer>
  <a class="whatsapp-float" href="https://wa.me/256765897583" target="_blank" rel="noopener" aria-label="Chat with Elegance Africa on WhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i><span>Need help?</span></a>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
  <script src="assets/js/products.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

Use these exact title/description pairs:

| Page | Title | Description |
|---|---|---|
| `shop.html` | `Shop Hair | Elegance Africa` | `Explore Elegance Africa's curated hair collection and enquire directly on WhatsApp.` |
| `product.html` | `Product Details | Elegance Africa` | `View the selected Elegance Africa hair piece and ask about price and availability.` |
| `about.html` | `Our Story | Elegance Africa` | `Meet the vision, values, and modern African identity behind Elegance Africa.` |
| `delivery-faq.html` | `Delivery & FAQ | Elegance Africa` | `Learn how to order, discuss delivery, care for your hair, and contact Elegance Africa.` |
| `contact.html` | `Contact | Elegance Africa` | `Contact Elegance Africa online by WhatsApp, phone, or email.` |
| `policies.html` | `Policies | Elegance Africa` | `Read the current privacy, terms, returns, and shipping guidance for Elegance Africa.` |

Set `data-page` on each body to `home`, `shop`, `product`, `about`, `support`, `contact`, and `policies` respectively. Set the initial `<main>` heading to `More than a brand. A signature.`, `The Hair Signature`, `Selected Signature`, `Our Story`, `Delivery & FAQ`, `Contact Elegance Africa`, and `Policies` respectively. The shared navigation links must be Home, Shop, Our Story, Delivery & FAQ, and Contact. The footer must show `+256 765 897 583`, `eeleganceafrica@gmail.com`, all seven local pages, and policy anchors `#privacy`, `#terms`, `#returns`, and `#shipping`.

- [ ] **Step 4: Create the visual foundation in `assets/css/styles.css`**

```css
:root {
  --ink: #0b0a09;
  --charcoal: #171512;
  --ivory: #f7f2e9;
  --cream: #eee4d5;
  --paper: #fffdf8;
  --gold: #c49a55;
  --gold-light: #e2c590;
  --taupe: #9c8b7b;
  --text: #29251f;
  --muted: #6f675e;
  --line: rgba(34, 29, 23, .16);
  --display: "Cormorant Garamond", Georgia, serif;
  --sans: "Manrope", Arial, sans-serif;
  --shadow: 0 24px 70px rgba(11, 10, 9, .14);
  --radius: .25rem;
}

html { scroll-behavior: smooth; }
body { margin: 0; background: var(--paper); color: var(--text); font-family: var(--sans); }
img { display: block; max-width: 100%; }
a { color: inherit; }
.skip-link { position: fixed; left: 1rem; top: -5rem; z-index: 2000; background: var(--paper); padding: .75rem 1rem; }
.skip-link:focus { top: 1rem; }
.announcement-bar { background: var(--ink); color: var(--gold-light); padding: .55rem 1rem; text-align: center; font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; }
.site-header { background: rgba(255, 253, 248, .94); border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 1030; backdrop-filter: blur(14px); }
.brand-logo { width: 56px; aspect-ratio: 1; object-fit: cover; }
.display-title { font-family: var(--display); font-weight: 500; line-height: .94; letter-spacing: -.03em; }
.eyebrow { color: var(--gold); font-size: .72rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
.btn-gold { background: var(--gold); border: 1px solid var(--gold); color: var(--ink); border-radius: 0; padding: .85rem 1.3rem; }
.btn-gold:hover, .btn-gold:focus-visible { background: var(--gold-light); border-color: var(--gold-light); color: var(--ink); }
.btn-outline-ink { border: 1px solid currentColor; border-radius: 0; padding: .85rem 1.3rem; }
.section-pad { padding-block: clamp(4.5rem, 8vw, 8rem); }
.dark-section { background: var(--ink); color: var(--ivory); }
.site-footer { background: var(--ink); color: var(--ivory); padding: 4rem 0 2rem; }
.whatsapp-float { align-items: center; background: #1f8f55; border-radius: 999px; bottom: 1rem; box-shadow: var(--shadow); color: white; display: flex; gap: .55rem; padding: .8rem 1rem; position: fixed; right: 1rem; text-decoration: none; z-index: 1040; }
:focus-visible { outline: 3px solid var(--gold-light); outline-offset: 3px; }
[data-reveal] { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
[data-reveal].is-visible { opacity: 1; transform: none; }
@media (max-width: 575.98px) { .whatsapp-float span { display: none; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } [data-reveal] { opacity: 1; transform: none; } }
```

- [ ] **Step 5: Create the safe shared JavaScript initializer**

```js
// assets/js/main.js
(function attachSite(root) {
  'use strict';

  function markActiveNavigation() {
    const page = document.body.dataset.page;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');
    });
  }

  function initImageFallbacks() {
    document.addEventListener('error', (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied) return;
      image.dataset.fallbackApplied = 'true';
      image.src = 'assets/images/logo.jpeg';
    }, true);
  }

  function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in root)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    items.forEach((item) => observer.observe(item));
  }

  function init() {
    markActiveNavigation();
    initImageFallbacks();
    initReveal();
  }

  root.EleganceSite = { init };
  document.addEventListener('DOMContentLoaded', init);
}(window));
```

- [ ] **Step 6: Run the shared-shell and catalogue tests**

Run: `node --test tests/catalog.test.js tests/pages.test.js`

Expected: 10 tests pass.

- [ ] **Step 7: Commit the shared foundation**

```powershell
git add index.html shop.html product.html about.html delivery-faq.html contact.html policies.html assets/css/styles.css assets/js/main.js tests/pages.test.js
git commit -m "feat: add shared luxury site foundation"
```

---

### Task 3: Compose the Editorial Homepage

**Files:**
- Modify: `index.html`
- Modify: `assets/css/styles.css`
- Modify: `assets/js/main.js`
- Create: `tests/home.test.js`

**Interfaces:**
- Consumes: `EleganceCatalog.products`, `EleganceCatalog.buildWhatsAppUrl()`, `[data-featured-grid]`, and `[data-newsletter-form]`.
- Produces: homepage sections `#new-arrivals`, `#categories`, `#story`, `#why`, `#experience`, `#find-signature`, `#reviews`, `#social`, and `#community`.

- [ ] **Step 1: Write the failing homepage coverage test**

```js
// tests/home.test.js
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
});
```

- [ ] **Step 2: Run the homepage test and confirm missing-section failures**

Run: `node --test tests/home.test.js`

Expected: FAIL because the approved section IDs are absent.

- [ ] **Step 3: Replace the homepage `<main>` with the approved narrative**

Use these exact lead messages and section hooks:

```html
<main id="main-content">
  <section class="hero-home">
    <div class="container-fluid h-100"><div class="row h-100 align-items-end">
      <div class="col-lg-7 hero-copy" data-reveal>
        <p class="eyebrow">Elegance Africa</p>
        <h1 class="display-title">Discover Your<br><em>Signature.</em></h1>
        <p>Beauty, elegance and confidence—thoughtfully selected for the modern African woman.</p>
        <div class="d-flex flex-wrap gap-3"><a class="btn btn-gold" href="shop.html">Shop the collection</a><a class="btn btn-outline-light rounded-0" href="about.html">Discover our story</a></div>
        <p class="hero-signature">More than a brand. A signature.</p>
      </div>
    </div></div>
  </section>
  <section id="new-arrivals" class="section-pad"><div class="container"><p class="eyebrow">The latest edit</p><h2 class="display-title">New arrivals</h2><div class="row g-4 mt-4" data-featured-grid></div></div></section>
  <section id="categories" class="section-pad dark-section"><div class="container"><p class="eyebrow">Shop by category</p><h2 class="display-title">A world of beauty,<br>chosen with intention.</h2><div class="row g-4 mt-4"><article class="col-md-6"><h3>Hair</h3><p>Wigs and signature looks selected for confidence and versatility.</p><a href="shop.html">Explore hair</a></article><article class="col-md-6"><h3>Fragrance</h3><p>Beautiful scents will join the collection as the brand grows.</p><span>Expanding soon</span></article><article class="col-md-6"><h3>Beauty</h3><p>Thoughtful essentials for the modern woman’s routine.</p><span>Expanding soon</span></article><article class="col-md-6"><h3>Accessories</h3><p>Selected finishing pieces for a complete signature.</p><span>Expanding soon</span></article></div></div></section>
  <section id="story" class="section-pad"><div class="container"><div class="row align-items-center g-5"><div class="col-lg-6"><img src="assets/images/aya-bob-2.jpeg" alt="Sleek warm brunette bob from the Elegance Africa hair edit" loading="lazy"></div><div class="col-lg-6"><p class="eyebrow">Our story</p><h2 class="display-title">Created for the woman who knows elegance is a feeling.</h2><p>Elegance Africa brings beauty, femininity, sophistication and quality together in one growing African lifestyle brand.</p><a class="btn btn-outline-ink" href="about.html">Discover Elegance Africa</a></div></div></div></section>
  <section id="why" class="section-pad bg-cream"><div class="container"><p class="eyebrow">Why Elegance Africa?</p><h2 class="display-title">The right details make the difference.</h2><div class="row g-4 mt-4"><article class="col-sm-6 col-lg-3"><h3>Quality</h3><p>Beauty begins with pieces chosen with care.</p></article><article class="col-sm-6 col-lg-3"><h3>Elegance</h3><p>Every touchpoint is refined, warm and intentional.</p></article><article class="col-sm-6 col-lg-3"><h3>Carefully selected</h3><p>A focused edit instead of an overwhelming catalogue.</p></article><article class="col-sm-6 col-lg-3"><h3>Customer experience</h3><p>Personal guidance from discovery to delivery.</p></article></div></div></section>
  <section id="experience" class="section-pad dark-section"><div class="container"><div class="row g-5 align-items-center"><div class="col-lg-5"><p class="eyebrow">The Elegance Experience</p><h2 class="display-title">Beautifully selected. Carefully prepared. Elegantly delivered.</h2><p>We are building an experience in which thoughtful presentation and personal care make every order feel special.</p></div><div class="col-lg-7"><img src="assets/images/zuri-straight-1.jpeg" alt="Smooth warm-toned straight hair from the Elegance Africa collection" loading="lazy"></div></div></div></section>
  <section id="find-signature" class="section-pad"><div class="container"><p class="eyebrow">Find Your Signature</p><h2 class="display-title">What expresses you?</h2><div class="row g-4 mt-4"><article class="col-lg-4 signature-card"><h3>Your Hair Signature</h3><p>Find a look that suits your mood, your moment and your confidence.</p><a href="shop.html">Find your hair</a></article><article class="col-lg-4 signature-card"><h3>Your Fragrance Signature</h3><p>Find a scent that feels unmistakably yours.</p><span>Expanding soon</span></article><article class="col-lg-4 signature-card"><h3>Your Beauty Signature</h3><p>Discover the finishing touches that complete your look.</p><span>Expanding soon</span></article></div></div></section>
  <section id="reviews" class="section-pad bg-cream"><div class="container"><p class="eyebrow">Customer love</p><h2 class="display-title">Your experience belongs here.</h2><div class="row g-4 mt-4"><article class="col-md-4"><h3>Customer stories coming soon</h3><p>Verified client words and approved images will be shared here as the Elegance Africa community grows.</p></article><article class="col-md-4"><h3>Share your signature</h3><p>Customers will be invited to share their look and experience with permission.</p></article><article class="col-md-4"><h3>Thoughtful service</h3><p>Until reviews are collected, contact us directly for product guidance.</p></article></div></div></section>
  <section id="social" class="section-pad dark-section"><div class="container text-center"><p class="eyebrow">Follow the journey</p><h2 class="display-title">Beauty in motion.</h2><p>New arrivals, styling inspiration and product stories will be shared across Instagram, TikTok and Facebook.</p><div class="d-flex justify-content-center flex-wrap gap-3"><span class="social-label">Instagram · Link coming soon</span><span class="social-label">TikTok · Link coming soon</span><span class="social-label">Facebook · Link coming soon</span></div></div></section>
  <section id="community" class="section-pad"><div class="container text-center"><p class="eyebrow">Join the community</p><h2 class="display-title">Be first to discover what’s next.</h2><form class="newsletter-form mx-auto" data-newsletter-form novalidate><label class="visually-hidden" for="newsletter-email">Email address</label><div class="input-group"><input class="form-control" id="newsletter-email" name="email" type="email" required placeholder="Email address"><button class="btn btn-gold" type="submit">Subscribe</button></div><div class="invalid-feedback">Enter a valid email address.</div></form><p class="form-note">Newsletter integration is being prepared. For now, follow our social channels or contact us on WhatsApp.</p><div class="form-status" aria-live="polite"></div></div></section>
</main>
```

Preserve the four promise items (Quality, Elegance, Carefully Selected, Customer Experience), the three Find Your Signature paths, and the explicit `Customer stories coming soon` treatment so no fabricated quotation or customer name is published.

- [ ] **Step 4: Add homepage catalogue and newsletter enhancements to `assets/js/main.js`**

```js
function productCardMarkup(product, index = 0) {
  return `<article class="col-12 col-md-6 col-xl-3" data-reveal style="--delay:${index * 70}ms">
    <a class="product-card" href="product.html?id=${encodeURIComponent(product.id)}">
      <span class="product-card__media"><img src="${product.images[0]}" alt="${product.name}, ${product.description}" loading="lazy"></span>
      <span class="product-card__meta"><small>${product.category}</small><strong>${product.name}</strong><span>${product.price}</span></span>
    </a>
  </article>`;
}

function renderFeaturedProducts() {
  const grid = document.querySelector('[data-featured-grid]');
  if (!grid || !window.EleganceCatalog) return;
  grid.innerHTML = window.EleganceCatalog.products.filter((product) => product.featured).slice(0, 4).map(productCardMarkup).join('');
}

function initNewsletter() {
  const form = document.querySelector('[data-newsletter-form]');
  if (!form) return;
  const status = form.parentElement.querySelector('.form-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      status.textContent = 'Please enter a valid email address.';
      return;
    }
    status.textContent = 'Thank you. Newsletter delivery will be connected in the next business-ready version.';
    form.reset();
    form.classList.remove('was-validated');
  });
}
```

Call `renderFeaturedProducts()` and `initNewsletter()` inside `init()` before `initReveal()`.

- [ ] **Step 5: Add homepage layout styles**

```css
.hero-home { min-height: min(880px, 92vh); background: linear-gradient(90deg, rgba(11,10,9,.94) 0%, rgba(11,10,9,.64) 50%, rgba(11,10,9,.16) 100%), url("../images/nia-wave-3.jpeg") center 30%/cover; color: var(--ivory); }
.hero-copy { padding: clamp(7rem, 15vw, 13rem) clamp(1rem, 6vw, 6rem) clamp(4rem, 8vw, 7rem); }
.hero-copy .display-title { font-size: clamp(4rem, 10vw, 9rem); }
.hero-signature { border-left: 1px solid var(--gold); margin-top: 2rem; padding-left: 1rem; }
.bg-cream { background: var(--cream); }
.product-card { display: block; text-decoration: none; }
.product-card__media { background: var(--cream); display: block; overflow: hidden; aspect-ratio: 3/4; }
.product-card__media img { height: 100%; object-fit: cover; transition: transform .6s ease; width: 100%; }
.product-card:hover .product-card__media img { transform: scale(1.025); }
.product-card__meta { display: grid; gap: .35rem; padding-top: 1rem; }
.product-card__meta strong { font-family: var(--display); font-size: 1.7rem; font-weight: 500; }
.signature-card { border-top: 1px solid var(--line); min-height: 16rem; padding: 2rem 0; }
```

- [ ] **Step 6: Run homepage and regression tests**

Run: `node --test tests/catalog.test.js tests/pages.test.js tests/home.test.js`

Expected: all tests pass.

- [ ] **Step 7: Commit the homepage**

```powershell
git add index.html assets/css/styles.css assets/js/main.js tests/home.test.js
git commit -m "feat: compose editorial Elegance Africa homepage"
```

---

### Task 4: Implement the Shop and Reusable Product Detail Experience

**Files:**
- Modify: `shop.html`
- Modify: `product.html`
- Modify: `assets/css/styles.css`
- Modify: `assets/js/main.js`
- Create: `tests/shop-product.test.js`

**Interfaces:**
- Consumes: `EleganceCatalog.filterProducts(tag)`, `EleganceCatalog.getProductById(id)`, `EleganceCatalog.buildWhatsAppUrl(name)`, and `productCardMarkup(product, index)`.
- Produces: `[data-product-grid]`, `[data-filter]`, `[data-empty-state]`, `[data-product-view]`, gallery `[data-gallery-main]`, and `[data-related-grid]`.

- [ ] **Step 1: Write the failing Shop/Product hook test**

```js
// tests/shop-product.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Shop exposes all approved filters and catalogue states', () => {
  const html = fs.readFileSync('shop.html', 'utf8');
  for (const tag of ['all', 'curly', 'straight', 'wavy', 'bob', 'statement']) {
    assert.match(html, new RegExp(`data-filter="${tag}"`));
  }
  assert.match(html, /data-product-grid/);
  assert.match(html, /data-empty-state/);
  assert.match(html, /Fragrance/);
  assert.match(html, /Beauty/);
  assert.match(html, /Accessories/);
  assert.match(html, /Expanding soon/);
});

test('Product page exposes reusable gallery, facts, CTA, and fallback hooks', () => {
  const html = fs.readFileSync('product.html', 'utf8');
  for (const hook of ['data-product-view', 'data-product-not-found', 'data-gallery-main', 'data-gallery-thumbs', 'data-product-name', 'data-product-price', 'data-product-description', 'data-product-availability', 'data-product-care', 'data-product-whatsapp', 'data-related-grid']) {
    assert.match(html, new RegExp(hook));
  }
  assert.match(html, /Available options are confirmed personally/);
});
```

- [ ] **Step 2: Run the Shop/Product test and confirm missing-hook failures**

Run: `node --test tests/shop-product.test.js`

Expected: FAIL because the page shells do not yet include the required hooks.

- [ ] **Step 3: Build `shop.html` content**

Create an ivory page hero headed `The Hair Signature`, filter buttons with `aria-pressed`, the product grid, hidden empty state with a reset button, and a dark `The world of Elegance Africa is growing` section containing Fragrance, Beauty, and Accessories cards labeled `Expanding soon`. Do not create links that imply those categories already contain products.

```html
<div class="catalog-filters" role="group" aria-label="Filter the hair collection">
  <button class="filter-btn is-active" type="button" data-filter="all" aria-pressed="true">All</button>
  <button class="filter-btn" type="button" data-filter="curly" aria-pressed="false">Curly</button>
  <button class="filter-btn" type="button" data-filter="straight" aria-pressed="false">Straight</button>
  <button class="filter-btn" type="button" data-filter="wavy" aria-pressed="false">Wavy</button>
  <button class="filter-btn" type="button" data-filter="bob" aria-pressed="false">Bob</button>
  <button class="filter-btn" type="button" data-filter="statement" aria-pressed="false">Statement colour</button>
</div>
<div class="row g-4" data-product-grid aria-live="polite"></div>
<div class="empty-state d-none" data-empty-state><h2>No pieces in this edit yet.</h2><button class="btn btn-outline-ink" type="button" data-reset-filter>View all hair</button></div>
```

- [ ] **Step 4: Build `product.html` content**

The default DOM must remain informative before JavaScript runs and must include this disclosure near the enquiry CTA: `Available options are confirmed personally. Send us a WhatsApp message for the current price, choices, and delivery discussion.`

```html
<section class="section-pad product-detail" data-product-view hidden>
  <div class="container"><div class="row g-5">
    <div class="col-lg-7"><img class="product-main-image" data-gallery-main src="assets/images/logo.jpeg" alt="Selected Elegance Africa product"><div class="gallery-thumbs" data-gallery-thumbs></div></div>
    <div class="col-lg-5"><p class="eyebrow">Hair · Signature edit</p><h1 class="display-title" data-product-name>Selected piece</h1><p class="product-price" data-product-price>Price on request</p><p data-product-description></p><p data-product-availability></p><p class="small">Available options are confirmed personally. Send us a WhatsApp message for the current price, choices, and delivery discussion.</p><a class="btn btn-gold" data-product-whatsapp target="_blank" rel="noopener">Enquire on WhatsApp</a><hr><h2>Care notes</h2><p data-product-care></p></div>
  </div></div>
</section>
<section class="section-pad" data-product-not-found hidden><div class="container text-center"><p class="eyebrow">Signature not found</p><h1 class="display-title">This piece could not be found.</h1><a class="btn btn-gold" href="shop.html">Return to the collection</a></div></section>
<section class="section-pad bg-cream"><div class="container"><h2 class="display-title">You may also love</h2><div class="row g-4 mt-4" data-related-grid></div></div></section>
```

- [ ] **Step 5: Implement filter, gallery, detail, and related-product rendering**

```js
function renderCatalog(tag = 'all') {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid || !window.EleganceCatalog) return;
  const products = window.EleganceCatalog.filterProducts(tag);
  grid.innerHTML = products.map(productCardMarkup).join('');
  document.querySelector('[data-empty-state]')?.classList.toggle('d-none', products.length !== 0);
}

function initCatalogFilters() {
  const controls = document.querySelectorAll('[data-filter]');
  if (!controls.length) return;
  controls.forEach((control) => control.addEventListener('click', () => {
    controls.forEach((item) => {
      const active = item === control;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderCatalog(control.dataset.filter);
  }));
  document.querySelector('[data-reset-filter]')?.addEventListener('click', () => controls[0].click());
  renderCatalog();
}

function renderProductPage() {
  const view = document.querySelector('[data-product-view]');
  if (!view || !window.EleganceCatalog) return;
  const product = window.EleganceCatalog.getProductById(new URLSearchParams(location.search).get('id'));
  const missing = document.querySelector('[data-product-not-found]');
  if (!product) {
    missing.hidden = false;
    document.querySelector('[data-related-grid]').innerHTML = window.EleganceCatalog.products.slice(0, 4).map(productCardMarkup).join('');
    return;
  }
  view.hidden = false;
  document.title = `${product.name} | Elegance Africa`;
  document.querySelector('[data-product-name]').textContent = product.name;
  document.querySelector('[data-product-price]').textContent = product.price;
  document.querySelector('[data-product-description]').textContent = product.description;
  document.querySelector('[data-product-availability]').textContent = product.availability;
  document.querySelector('[data-product-care]').textContent = product.care;
  const mainImage = document.querySelector('[data-gallery-main]');
  mainImage.src = product.images[0];
  mainImage.alt = `${product.name}, ${product.description}`;
  document.querySelector('[data-product-whatsapp]').href = window.EleganceCatalog.buildWhatsAppUrl(product.name);
  document.querySelector('[data-gallery-thumbs]').innerHTML = product.images.map((image, index) => `<button type="button" data-gallery-image="${image}" aria-label="View image ${index + 1} of ${product.name}"><img src="${image}" alt=""></button>`).join('');
  document.querySelectorAll('[data-gallery-image]').forEach((button) => button.addEventListener('click', () => { mainImage.src = button.dataset.galleryImage; }));
  document.querySelector('[data-related-grid]').innerHTML = window.EleganceCatalog.products.filter((item) => item.id !== product.id).slice(0, 4).map(productCardMarkup).join('');
}
```

Call `initCatalogFilters()` and `renderProductPage()` inside `init()`.

- [ ] **Step 6: Style the Shop and Product pages**

```css
.page-hero { background: var(--cream); padding: clamp(5rem, 10vw, 9rem) 0; }
.page-hero .display-title { font-size: clamp(3.5rem, 8vw, 7rem); }
.catalog-filters { display: flex; flex-wrap: wrap; gap: .6rem; margin-bottom: 2.5rem; }
.filter-btn { background: transparent; border: 1px solid var(--line); padding: .7rem 1rem; }
.filter-btn.is-active { background: var(--ink); color: var(--ivory); }
.product-main-image { aspect-ratio: 4/5; background: var(--cream); object-fit: cover; width: 100%; }
.gallery-thumbs { display: grid; gap: .75rem; grid-template-columns: repeat(4, 1fr); margin-top: .75rem; }
.gallery-thumbs button { background: transparent; border: 1px solid var(--line); padding: 0; }
.gallery-thumbs img { aspect-ratio: 1; object-fit: cover; width: 100%; }
.product-price { color: var(--gold); font-size: 1.05rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.empty-state { border: 1px solid var(--line); padding: 4rem 1rem; text-align: center; }
```

- [ ] **Step 7: Run Shop/Product and regression tests**

Run: `node --test tests/catalog.test.js tests/pages.test.js tests/home.test.js tests/shop-product.test.js`

Expected: all tests pass.

- [ ] **Step 8: Commit the catalogue experience**

```powershell
git add shop.html product.html assets/css/styles.css assets/js/main.js tests/shop-product.test.js
git commit -m "feat: add filterable shop and product enquiries"
```

---

### Task 5: Write the About, Delivery, and FAQ Pages

**Files:**
- Modify: `about.html`
- Modify: `delivery-faq.html`
- Modify: `assets/css/styles.css`
- Create: `tests/support-content.test.js`

**Interfaces:**
- Consumes: shared page shell and Bootstrap accordion JavaScript.
- Produces: brief-derived story sections and FAQ accordion `#eleganceFaq`.

- [ ] **Step 1: Write the failing support-content test**

```js
// tests/support-content.test.js
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
  assert.match(html, /Kampala/);
  assert.match(html, /across Uganda/);
  assert.match(html, /international and African delivery/i);
  assert.match(html, /confirmed before payment/i);
  assert.match(html, /id="eleganceFaq"/);
  assert.doesNotMatch(html, /same-day|next-day|free delivery|UGX\s*\d/i);
});
```

- [ ] **Step 2: Run the support-content test and confirm failure**

Run: `node --test tests/support-content.test.js`

Expected: FAIL because the page shells do not contain the required content.

- [ ] **Step 3: Compose `about.html` from the approved brief**

Use five editorial sections with these exact headings: `Our story`, `Our vision`, `Modern African femininity`, `Quality before quantity`, and `More than a brand. A signature.` Keep the complete page under 900 words. Include the statement `Elegance is not something you buy. It is something you embody.` and describe Hair as the launch focus while Fragrance, Beauty, and Accessories remain part of the larger vision.

- [ ] **Step 4: Compose `delivery-faq.html` with truthful delivery guidance**

The delivery introduction must state:

```html
<p>Elegance Africa is an online business. We discuss Kampala delivery, delivery across Uganda, and international and African delivery individually so the destination, fee, estimated timing, and handover method can be confirmed before payment.</p>
```

Add eight Bootstrap accordion items answering:

1. How do I place an order? — Select a piece, tap Enquire on WhatsApp, and confirm options with the team.
2. Where do you deliver? — Kampala, destinations across Uganda, and eligible international/African destinations by confirmation.
3. How long will delivery take? — Timing depends on availability and destination and is confirmed before payment.
4. Which payment methods are accepted? — Current methods are shared and confirmed during the order conversation; do not list unconfirmed methods.
5. Can I exchange an item? — Eligibility must be confirmed before ordering and final terms are provided by the business.
6. How do I care for my hair? — Start with the care note on the product page and ask for piece-specific instructions.
7. How do I check availability? — Contact WhatsApp with the product name.
8. How can I contact Elegance Africa? — WhatsApp `+256 765 897 583` or email `eeleganceafrica@gmail.com`.

- [ ] **Step 5: Add story and FAQ styles**

```css
.story-number { color: var(--gold); font-family: var(--display); font-size: 4rem; line-height: 1; }
.story-panel { border-top: 1px solid var(--line); padding-block: 2.5rem; }
.accordion-elegance { --bs-accordion-bg: transparent; --bs-accordion-border-color: var(--line); --bs-accordion-btn-focus-box-shadow: 0 0 0 .2rem rgba(196,154,85,.28); --bs-accordion-active-bg: var(--cream); --bs-accordion-active-color: var(--ink); }
.accordion-elegance .accordion-button { font-family: var(--display); font-size: 1.35rem; }
```

- [ ] **Step 6: Run support and regression tests**

Run: `node --test`

Expected: all current tests pass.

- [ ] **Step 7: Commit the story and support pages**

```powershell
git add about.html delivery-faq.html assets/css/styles.css tests/support-content.test.js
git commit -m "feat: add brand story and delivery guidance"
```

---

### Task 6: Add Contact, Email Form, and Policy Guidance

**Files:**
- Modify: `contact.html`
- Modify: `policies.html`
- Modify: `assets/css/styles.css`
- Modify: `assets/js/main.js`
- Create: `tests/contact-policy.test.js`

**Interfaces:**
- Consumes: `[data-contact-form]`, `.form-status`, and the shared business contact facts.
- Produces: validated `mailto:` fallback and policy anchors `#privacy`, `#terms`, `#returns`, `#shipping`.

- [ ] **Step 1: Write the failing contact/policy test**

```js
// tests/contact-policy.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Contact page uses the approved online contact details and honest form behaviour', () => {
  const html = fs.readFileSync('contact.html', 'utf8');
  assert.match(html, /\+256 765 897 583/);
  assert.match(html, /eeleganceafrica@gmail\.com/);
  assert.match(html, /data-contact-form/);
  assert.match(html, /opens your email application/i);
  assert.doesNotMatch(html, /our location|visit us|opening hours/i);
});

test('Policies page provides all four caveated starter sections', () => {
  const html = fs.readFileSync('policies.html', 'utf8');
  for (const id of ['privacy', 'terms', 'returns', 'shipping']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /Final commercial terms are confirmed by Elegance Africa/i);
  assert.doesNotMatch(html, /non-refundable|delivery within \d|refund within \d/i);
});
```

- [ ] **Step 2: Run the contact/policy test and confirm failure**

Run: `node --test tests/contact-policy.test.js`

Expected: FAIL because the page shells lack the required content.

- [ ] **Step 3: Build the online-only contact page**

Use two columns: a dark contact-information panel and an ivory form panel. The contact panel must include the approved phone and email plus non-linked labels `Instagram · Link coming soon`, `TikTok · Link coming soon`, and `Facebook · Link coming soon`. The form must contain labeled Name, Email, Phone or WhatsApp, Interest (`Hair`, `Fragrance`, `Beauty`, `Accessories`, `General enquiry`), and Message fields. Under the submit button, include: `Submitting this form opens your email application with the enquiry prepared. Nothing is sent automatically from this static website.`

```html
<form data-contact-form novalidate>
  <label for="contact-name">Name</label><input class="form-control" id="contact-name" name="name" required>
  <label for="contact-email">Email</label><input class="form-control" id="contact-email" name="email" type="email" required>
  <label for="contact-phone">Phone or WhatsApp</label><input class="form-control" id="contact-phone" name="phone" type="tel">
  <label for="contact-interest">What are you interested in?</label><select class="form-select" id="contact-interest" name="interest" required><option value="">Choose one</option><option>Hair</option><option>Fragrance</option><option>Beauty</option><option>Accessories</option><option>General enquiry</option></select>
  <label for="contact-message">Message</label><textarea class="form-control" id="contact-message" name="message" rows="6" required></textarea>
  <button class="btn btn-gold" type="submit">Prepare email enquiry</button>
  <p class="form-note">Submitting this form opens your email application with the enquiry prepared. Nothing is sent automatically from this static website.</p>
  <div class="form-status" aria-live="polite"></div>
</form>
```

- [ ] **Step 4: Implement the mail-client fallback in `assets/js/main.js`**

```js
function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      status.textContent = 'Please complete the required fields.';
      return;
    }
    const values = Object.fromEntries(new FormData(form).entries());
    const subject = `Elegance Africa enquiry: ${values.interest}`;
    const body = `Name: ${values.name}\nEmail: ${values.email}\nPhone/WhatsApp: ${values.phone || 'Not provided'}\nInterest: ${values.interest}\n\n${values.message}`;
    status.textContent = 'Your email application is opening with the enquiry prepared.';
    window.location.href = `mailto:eeleganceafrica@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
```

Call `initContactForm()` inside `init()`.

- [ ] **Step 5: Write the four starter policy sections**

Begin `policies.html` with this visible notice:

```html
<div class="policy-notice" role="note"><strong>Current website guidance:</strong> Final commercial terms are confirmed by Elegance Africa during the order conversation and should be reviewed by the business before public launch.</div>
```

Write concise sections that:

- explain that contact details submitted through email or WhatsApp are used to respond to enquiries;
- state that product availability, options, price, payment method, and delivery details are agreed before an order is confirmed;
- require customers to ask about return or exchange eligibility before payment because no universal exchange promise is yet published;
- state that delivery destinations, fees, handover methods, and estimated timing are confirmed individually.

- [ ] **Step 6: Add contact and policy styling**

```css
.contact-panel { background: var(--ink); color: var(--ivory); min-height: 100%; padding: clamp(2rem, 6vw, 5rem); }
.contact-form-panel { background: var(--ivory); padding: clamp(2rem, 6vw, 5rem); }
.contact-form-panel .form-control, .contact-form-panel .form-select { background: transparent; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; padding-inline: 0; }
.form-note, .form-status { color: var(--muted); font-size: .82rem; margin-top: 1rem; }
.policy-notice { background: var(--cream); border-left: 3px solid var(--gold); padding: 1.25rem; }
.policy-section { border-top: 1px solid var(--line); padding-block: 3rem; scroll-margin-top: 8rem; }
```

- [ ] **Step 7: Run contact/policy and regression tests**

Run: `node --test`

Expected: all current tests pass.

- [ ] **Step 8: Commit contact and policies**

```powershell
git add contact.html policies.html assets/css/styles.css assets/js/main.js tests/contact-policy.test.js
git commit -m "feat: add online contact and policy guidance"
```

---

### Task 7: Verify Static-Site Integrity and Release Readiness

**Files:**
- Create: `tests/links.test.js`
- Modify only if a check fails: `index.html`, `shop.html`, `product.html`, `about.html`, `delivery-faq.html`, `contact.html`, `policies.html`, `assets/css/styles.css`, `assets/js/products.js`, `assets/js/main.js`

**Interfaces:**
- Consumes: all completed pages and local assets.
- Produces: a tested static directory with no broken internal file or anchor references.

- [ ] **Step 1: Write the local-link and anchor integrity test**

```js
// tests/links.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const pages = ['index.html', 'shop.html', 'product.html', 'about.html', 'delivery-faq.html', 'contact.html', 'policies.html'];
const external = /^(?:https?:|mailto:|tel:|javascript:)/;

for (const page of pages) {
  test(`${page} has valid local href and src targets`, () => {
    const html = fs.readFileSync(page, 'utf8');
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    for (const ref of refs) {
      if (!ref || external.test(ref) || ref.startsWith('data:')) continue;
      const [filePart, anchor] = ref.split('#');
      const cleanFile = (filePart || page).split('?')[0];
      const target = path.resolve(path.dirname(page), cleanFile);
      assert.equal(fs.existsSync(target), true, `${page} -> ${ref}`);
      if (anchor && path.extname(target) === '.html') {
        const targetHtml = fs.readFileSync(target, 'utf8');
        assert.match(targetHtml, new RegExp(`id="${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), `${page} -> ${ref}`);
      }
    }
  });
}
```

- [ ] **Step 2: Run the full suite and observe any integrity failure**

Run: `node --test`

Expected: all tests pass. If a failure names a missing target or anchor, correct that exact reference and rerun until green.

- [ ] **Step 3: Check JavaScript syntax independently**

```powershell
Get-ChildItem -LiteralPath 'assets/js' -Filter '*.js' | ForEach-Object { node --check $_.FullName }
```

Expected: no syntax errors and exit code 0.

- [ ] **Step 4: Check every supplied local image resolves from the catalogue**

Run: `node --test tests/catalog.test.js tests/links.test.js`

Expected: all catalogue and link tests pass.

- [ ] **Step 5: Serve the site and perform HTTP smoke checks without a build step**

Start in a retained terminal: `python -m http.server 8000`

In another terminal run:

```powershell
$pathsToCheck = '/', '/shop.html', '/product.html?id=aya-bob', '/about.html', '/delivery-faq.html', '/contact.html', '/policies.html'
$pathsToCheck | ForEach-Object {
  $response = Invoke-WebRequest -Uri ("http://localhost:8000" + $_) -UseBasicParsing
  if ($response.StatusCode -ne 200) { throw "HTTP check failed for $_" }
}
```

Expected: every request returns HTTP 200. Stop the server after the checks.

- [ ] **Step 6: Run final content-safety searches**

```powershell
rg -n -i "street address|visit our store|opening hours|same-day|next-day|free delivery|add to cart|checkout|buy now|UGX\s*[0-9]|USD\s*[0-9]" *.html assets/js
rg -n "256765897583|\+256 765 897 583|eeleganceafrica@gmail.com|Price on request" *.html assets/js
```

Expected: the first search returns no matches. The second search returns the approved contact and pricing references.

- [ ] **Step 7: Inspect the final repository scope**

Run: `git status --short`

Expected: only intentional website and test files are modified or untracked; original root-level WhatsApp images are ignored.

- [ ] **Step 8: Commit any verification fixes**

```powershell
git add index.html shop.html product.html about.html delivery-faq.html contact.html policies.html assets tests/links.test.js
git commit -m "test: verify static site integrity"
```

If no files changed after the checks, do not create an empty commit.

## Completion Criteria

- Seven pages render through a static HTTP server with shared navigation and footer.
- Six hair products render from one catalogue and open correct product-detail URLs.
- Shop filters, product galleries, related products, missing-product state, newsletter status, and contact form behave as specified.
- Every product enquiry targets `https://wa.me/256765897583` with the product name in the message.
- Every product shows `Price on request` and no unconfirmed commerce or delivery claim appears.
- The supplied black-and-gold logo and curated product photography are used throughout.
- All Node tests and JavaScript syntax checks pass.
- Local links, anchors, scripts, stylesheets, and images resolve without broken references.
- The design remains usable with keyboard navigation and reduced motion.
