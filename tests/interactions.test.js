const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
  constructor() { this.hidden = false; this.listeners = {}; this.queries = {}; this.queryLists = {}; this.classList = { add() {}, remove() {}, toggle() {} }; }
  querySelector(selector) { return this.queries[selector] || null; }
  querySelectorAll(selector) { return this.queryLists[selector] || []; }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  emit(type) { this.listeners[type]?.({ preventDefault() {} }); }
  focus() { this.focused = true; }
  after() {}
}

function runSite(document, catalog, search = '') {
  const window = { EleganceCatalog: catalog };
  vm.runInNewContext(fs.readFileSync('assets/js/main.js', 'utf8'), {
    window, document, location: { search }, URLSearchParams, HTMLImageElement: class {},
    FormData: class { constructor(form) { this.form = form; } entries() { return Object.entries(this.form.values || {}); } },
    matchMedia: () => ({ matches: true }), encodeURIComponent
  });
  return window.EleganceSite;
}

test('quiz progresses through answers and renders the recommended product', () => {
  const form = new Element(); const result = new Element(); const quiz = new Element(); const steps = [new Element(), new Element(), new Element()]; const next = [new Element(), new Element()];
  const inputs = ['curly', 'evening', 'bold'].map((value) => Object.assign(new Element(), { checked: true, value }));
  steps.forEach((step, index) => { step.queries.legend = new Element(); step.queries['input:checked'] = inputs[index]; step.queries.input = inputs[index]; });
  form.values = { texture: 'curly', occasion: 'evening', preference: 'bold' }; quiz.queries.form = form; quiz.queries['[data-quiz-result]'] = result; quiz.queryLists['[data-quiz-step]'] = steps; quiz.queryLists['[data-quiz-next]'] = next; quiz.queryLists['[data-quiz-back]'] = []; quiz.queryLists['.quiz-progress span'] = [new Element(), new Element(), new Element()];
  const document = { body: { dataset: {} }, documentElement: { classList: { add() {} } }, addEventListener() {}, querySelector: (selector) => selector === '[data-signature-quiz]' ? quiz : null, querySelectorAll: () => [] };
  const site = runSite(document, { recommendProduct: () => ({ id: 'sanaa-burgundy', name: 'The Sanaa Burgundy', description: 'Bold curl.' }) });
  site.initSignatureQuiz(); next[0].emit('click'); next[1].emit('click'); form.emit('submit');
  assert.equal(steps[0].hidden, true); assert.equal(steps[1].hidden, true); assert.equal(steps[2].queries.legend.focused, true); assert.equal(form.hidden, true); assert.equal(result.hidden, false); assert.match(result.innerHTML, /The Sanaa Burgundy/); assert.match(result.innerHTML, /product\.html\?id=sanaa-burgundy/);
});

test('product page renders active options and refreshes WhatsApp enquiry after a selection change', () => {
  const selectors = new Map(); const element = (selector) => { const item = new Element(); selectors.set(selector, item); return item; };
  const view = element('[data-product-view]'); element('[data-product-not-found]'); element('[data-related-grid]'); element('[data-product-name]'); element('[data-product-price]'); const description = element('[data-product-description]'); element('[data-product-availability]'); element('[data-product-care]'); const style = element('[data-product-style]'); const mainImage = element('[data-gallery-main]'); const length = Object.assign(element('[data-product-length]'), { value: '12"' }); const density = Object.assign(element('[data-product-density]'), { value: '130%' }); const whatsapp = element('[data-product-whatsapp]'); element('[data-gallery-thumbs]');
  selectors.set('[data-product-selector-template]', { content: { cloneNode: () => ({}) } }); description.after = () => {};
  const document = { title: '', body: { dataset: {} }, documentElement: { classList: { add() {} } }, addEventListener() {}, querySelector: (selector) => selectors.get(selector) || null, querySelectorAll: () => [] };
  const product = { id: 'sample', name: 'Sample', price: 'Price on request', description: 'Description', availability: 'Personal confirmation', care: 'Care', wearItHow: 'Wear it boldly.', lengths: ['12"', '16"'], densities: ['130%', '180%'], images: ['image.jpeg'] };
  const site = runSite(document, { products: [product], getProductById: () => product, buildWhatsAppUrl: (name, options) => `${name}|${options.length}|${options.density}` }, '?id=sample');
  site.renderProductPage();
  assert.equal(view.hidden, false); assert.equal(style.textContent, 'Wear it boldly.'); assert.match(length.innerHTML, /16&quot;|16"/); assert.match(density.innerHTML, /180%/); assert.equal(whatsapp.href, 'Sample|12"|130%');
  density.value = ''; length.value = '16"'; length.emit('change');
  assert.equal(whatsapp.href, 'Sample|16"|');
  density.value = '180%'; density.emit('change');
  assert.equal(whatsapp.href, 'Sample|16"|180%'); assert.equal(mainImage.src, 'image.jpeg');
});

test('product page publishes product-specific metadata without an invented price', () => {
  const selectors = new Map(); const element = (selector) => { const item = new Element(); item.attributes = {}; item.setAttribute = (name, value) => { item.attributes[name] = value; }; selectors.set(selector, item); return item; };
  const view = element('[data-product-view]'); element('[data-product-not-found]'); element('[data-related-grid]'); element('[data-product-name]'); element('[data-product-price]'); const description = element('[data-product-description]'); element('[data-product-availability]'); element('[data-product-care]'); element('[data-product-style]'); element('[data-gallery-main]'); const length = Object.assign(element('[data-product-length]'), { value: '12"' }); const density = Object.assign(element('[data-product-density]'), { value: '130%' }); element('[data-product-whatsapp]'); element('[data-gallery-thumbs]');
  selectors.set('[data-product-selector-template]', { content: { cloneNode: () => ({}) } }); description.after = () => {};
  const canonical = element('[data-product-canonical]'); const descriptionMeta = element('meta[name="description"]'); const titleMeta = element('[data-product-og-title]'); const openGraphDescription = element('[data-product-og-description]'); const imageMeta = element('[data-product-og-image]'); const urlMeta = element('[data-product-og-url]'); const schema = element('[data-product-schema]');
  const document = { title: '', body: { dataset: {} }, documentElement: { classList: { add() {} } }, addEventListener() {}, querySelector: (selector) => selectors.get(selector) || null, querySelectorAll: () => [] };
  const product = { id: 'sample', name: 'Sample', price: 'Price on request', description: 'Description', availability: 'Personal confirmation', care: 'Care', wearItHow: 'Wear it boldly.', lengths: ['12"'], densities: ['130%'], images: ['image.jpeg'] };
  const site = runSite(document, { products: [product], getProductById: () => product, buildWhatsAppUrl: () => '' }, '?id=sample');
  site.renderProductPage();
  assert.equal(view.hidden, false); assert.equal(canonical.attributes.href, 'product.html?id=sample'); assert.equal(descriptionMeta.attributes.content, 'Description'); assert.equal(titleMeta.attributes.content, 'Sample | Elegance Africa'); assert.equal(openGraphDescription.attributes.content, 'Description'); assert.equal(imageMeta.attributes.content, 'image.jpeg'); assert.equal(urlMeta.attributes.content, 'product.html?id=sample');
  const data = JSON.parse(schema.textContent); assert.equal(data.name, 'Sample'); assert.deepEqual(data.image, ['image.jpeg']); assert.equal(data.brand.name, 'Elegance Africa'); assert.equal('price' in data, false); assert.equal('offers' in data, false);
});
