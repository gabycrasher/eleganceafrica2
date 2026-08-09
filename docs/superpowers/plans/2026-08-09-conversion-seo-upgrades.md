# Elegance Africa conversion and sharing upgrades Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve product discovery, enquiry quality, sharing metadata, and static-site resilience without adding a backend.

**Architecture:** `products.js` is the single source of truth for product styling guidance and available enquiry options. `main.js` will expose deterministic helpers for quiz recommendations and WhatsApp URLs, then bind them to homepage and product-page markup. Static head markup supplies site-wide sharing data; the product view adds product-specific canonical, Open Graph, and JSON-LD data at runtime.

**Tech Stack:** HTML5, Bootstrap 5, vanilla JavaScript, Node built-in test runner.

## Global Constraints

- Keep all products as **Price on request**; do not invent USD or UGX prices.
- WhatsApp enquiries use `+256 765 897 583` / `https://wa.me/256765897583`.
- Newsletter signup must remain explicitly unconnected until the owner supplies an external endpoint.
- No backend, account system, or third-party newsletter endpoint is added.
- Reuse the existing supplied local images.

---

### Task 1: Extend product data and pure recommendation/enquiry helpers

**Files:**
- Modify: `assets/js/products.js`
- Modify: `tests/catalog.test.js`

**Interfaces:**
- Produces: `recommendProduct(answers)` accepting `{ texture, occasion, preference }` and returning one existing product.
- Produces: `buildWhatsAppUrl(productName, options)` accepting optional `{ length, density }`.
- Produces: product fields `wearItHow`, `lengths`, and `densities` for every catalogue item.

- [ ] **Step 1: Write the failing test**

```js
test('catalogue recommends a selected signature and carries enquiry options', () => {
  const result = catalog.recommendProduct({ texture: 'wavy', occasion: 'evening', preference: 'soft' });
  assert.equal(result.id, 'nia-wave');
  assert.deepEqual(result.lengths, ['12"', '14"', '16"', '18"']);
  assert.match(result.wearItHow, /evening/i);
});

test('WhatsApp enquiry includes selected length and density', () => {
  const url = catalog.buildWhatsAppUrl('The Nia Wave', { length: '16"', density: '150%' });
  assert.match(decodeURIComponent(url), /Length: 16"/);
  assert.match(decodeURIComponent(url), /Density: 150%/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/catalog.test.js`

Expected: FAIL because `recommendProduct` and the option/style fields do not exist.

- [ ] **Step 3: Write minimal implementation**

```js
function recommendProduct({ texture, occasion, preference }) {
  const id = texture === 'straight' ? 'zuri-straight'
    : texture === 'curly' && preference === 'bold' ? 'sanaa-burgundy'
    : texture === 'curly' ? 'amara-coil'
    : texture === 'short' ? 'aya-bob'
    : 'nia-wave';
  return getProductById(id);
}

function buildWhatsAppUrl(productName, options = {}) {
  const choices = [options.length && `Length: ${options.length}`, options.density && `Density: ${options.density}`].filter(Boolean);
  const message = `Hello Elegance Africa, I'm interested in ${productName}.${choices.length ? ` ${choices.join(', ')}.` : ''} Please share the available options and price.`;
  return `https://wa.me/256765897583?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/catalog.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add assets/js/products.js tests/catalog.test.js
git commit -m "feat: add product recommendation and enquiry data"
```

### Task 2: Add quiz and product-page selector experiences

**Files:**
- Modify: `index.html`
- Modify: `product.html`
- Modify: `assets/js/main.js`
- Modify: `assets/css/styles.css`
- Modify: `tests/home.test.js`
- Modify: `tests/shop-product.test.js`

**Interfaces:**
- Consumes: `EleganceCatalog.recommendProduct(answers)` and `EleganceCatalog.buildWhatsAppUrl(name, options)`.
- Produces: homepage hooks `data-signature-quiz`, `data-quiz-step`, `data-quiz-result` and product hooks `data-product-length`, `data-product-density`, `data-product-style`.

- [ ] **Step 1: Write the failing tests**

```js
test('homepage contains an interactive signature quiz', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  for (const hook of ['data-signature-quiz', 'data-quiz-step', 'data-quiz-result']) assert.match(html, new RegExp(hook));
  assert.match(html, /Hair texture/i); assert.match(html, /Occasion/i); assert.match(html, /Style preference/i);
});

test('product page exposes selector and styling hooks', () => {
  const html = fs.readFileSync('product.html', 'utf8');
  for (const hook of ['data-product-length', 'data-product-density', 'data-product-style']) assert.match(html, new RegExp(hook));
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/home.test.js tests/shop-product.test.js`

Expected: FAIL because the quiz and selector hooks are absent.

- [ ] **Step 3: Write minimal implementation**

```js
function initSignatureQuiz() {
  const quiz = document.querySelector('[data-signature-quiz]');
  if (!quiz || !root.EleganceCatalog) return;
  // Move through texture, occasion, and preference controls; render one recommendation link.
}

function selectedProductOptions() {
  return {
    length: document.querySelector('[data-product-length]')?.value || '',
    density: document.querySelector('[data-product-density]')?.value || ''
  };
}
```

Populate the two product selectors and the wear-it-how paragraph from the active product. Rebuild the enquiry URL whenever a selector changes. Style the quiz cards, step progress, result card, and selectors with the existing cream/ink/gold design tokens.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/home.test.js tests/shop-product.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html product.html assets/js/main.js assets/css/styles.css tests/home.test.js tests/shop-product.test.js
git commit -m "feat: add signature quiz and product selectors"
```

### Task 3: Add sharing, SEO, performance, and static fallback assets

**Files:**
- Create: `assets/images/favicon.svg`
- Create: `404.html`
- Modify: `index.html`
- Modify: `product.html`
- Modify: `assets/js/main.js`
- Modify: `tests/pages.test.js`

**Interfaces:**
- Produces: site-wide `og:title`, `og:description`, `og:image`, `twitter:card`, favicon, and hero-image preload markup.
- Produces: product JSON-LD script identified by `data-product-schema` and product-specific canonical/Open Graph values for valid product IDs.

- [ ] **Step 1: Write the failing test**

```js
test('site includes share metadata and a branded 404 page', () => {
  const home = fs.readFileSync('index.html', 'utf8');
  const notFound = fs.readFileSync('404.html', 'utf8');
  for (const value of ['rel="icon"', 'property="og:title"', 'property="og:image"', 'name="twitter:card"', 'rel="preload"']) assert.match(home, new RegExp(value));
  assert.match(notFound, /Page not found/i); assert.match(notFound, /shop\.html/);
});

test('product page has a structured-data hook', () => {
  const html = fs.readFileSync('product.html', 'utf8');
  assert.match(html, /data-product-schema/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/pages.test.js`

Expected: FAIL because the asset, metadata, 404 page, and schema hook do not yet exist.

- [ ] **Step 3: Write minimal implementation**

```html
<link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="Elegance Africa | More than a brand, a signature.">
<meta property="og:image" content="assets/images/nia-wave-3.jpeg">
<link rel="preload" as="image" href="assets/images/nia-wave-3.jpeg">
```

```js
schema.textContent = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Product',
  name: product.name, image: product.images, description: product.description,
  brand: { '@type': 'Organization', name: 'Elegance Africa' },
  offers: { '@type': 'Offer', priceCurrency: 'UGX', availability: 'https://schema.org/PreOrder' }
});
```

Create a compact `404.html` using the existing shared shell, with links to `shop.html` and WhatsApp. Use the local SVG favicon in every page head and preserve the unconnected newsletter message.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/pages.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add 404.html assets/images/favicon.svg index.html product.html assets/js/main.js tests/pages.test.js
git commit -m "feat: add sharing metadata and branded fallback"
```

### Task 4: Run full verification

**Files:**
- Modify only if verification exposes a defect.

- [ ] **Step 1: Run the full automated suite**

Run: `node --test`

Expected: all tests pass.

- [ ] **Step 2: Check JavaScript syntax and patch consistency**

Run: `Get-ChildItem assets/js -Filter '*.js' | ForEach-Object { node --check $_.FullName }; git diff --check`

Expected: no syntax or whitespace errors.

- [ ] **Step 3: Smoke-test static routes**

Run a local static server and request `/`, `/shop.html`, `/product.html?id=nia-wave`, and `/404.html`.

Expected: every route responds with HTTP 200.

- [ ] **Step 4: Confirm the working tree contains only intentional changes**

Run: `git status --short`

Expected: no unexpected files or edits remain.
