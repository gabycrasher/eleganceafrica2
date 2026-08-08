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

  function productCardMarkup(product, index = 0) {
    return `<article class="col-12 col-md-6 col-xl-3" data-reveal style="--delay:${index * 70}ms"><a class="product-card" href="product.html?id=${encodeURIComponent(product.id)}"><span class="product-card__media"><img src="${product.images[0]}" alt="${product.name}, ${product.description}" loading="lazy"></span><span class="product-card__meta"><small>${product.category}</small><strong>${product.name}</strong><span>${product.price}</span></span></a></article>`;
  }

  function renderFeaturedProducts() {
    const grid = document.querySelector('[data-featured-grid]');
    if (!grid || !root.EleganceCatalog) return;
    grid.innerHTML = root.EleganceCatalog.products.filter((product) => product.featured).slice(0, 4).map(productCardMarkup).join('');
  }

  function initNewsletter() {
    const form = document.querySelector('[data-newsletter-form]');
    if (!form) return;
    const status = form.parentElement.querySelector('.form-status');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.classList.add('was-validated'); status.textContent = 'Please enter a valid email address.'; return; }
      status.textContent = 'Thank you. Newsletter delivery will be connected in the next business-ready version.';
      form.reset(); form.classList.remove('was-validated');
    });
  }

  function renderCatalog(tag = 'all') {
    const grid = document.querySelector('[data-product-grid]');
    if (!grid || !root.EleganceCatalog) return;
    const products = root.EleganceCatalog.filterProducts(tag);
    grid.innerHTML = products.map(productCardMarkup).join('');
    document.querySelector('[data-empty-state]')?.classList.toggle('d-none', products.length !== 0);
  }

  function initCatalogFilters() {
    const controls = document.querySelectorAll('[data-filter]');
    if (!controls.length) return;
    controls.forEach((control) => control.addEventListener('click', () => {
      controls.forEach((item) => { const active = item === control; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
      renderCatalog(control.dataset.filter);
    }));
    document.querySelector('[data-reset-filter]')?.addEventListener('click', () => controls[0].click());
    renderCatalog();
  }

  function renderProductPage() {
    const view = document.querySelector('[data-product-view]');
    if (!view || !root.EleganceCatalog) return;
    const product = root.EleganceCatalog.getProductById(new URLSearchParams(location.search).get('id'));
    const missing = document.querySelector('[data-product-not-found]');
    const related = document.querySelector('[data-related-grid]');
    if (!product) { missing.hidden = false; related.innerHTML = root.EleganceCatalog.products.slice(0, 4).map(productCardMarkup).join(''); return; }
    view.hidden = false; document.title = `${product.name} | Elegance Africa`;
    document.querySelector('[data-product-name]').textContent = product.name;
    document.querySelector('[data-product-price]').textContent = product.price;
    document.querySelector('[data-product-description]').textContent = product.description;
    document.querySelector('[data-product-availability]').textContent = product.availability;
    document.querySelector('[data-product-care]').textContent = product.care;
    const mainImage = document.querySelector('[data-gallery-main]'); mainImage.src = product.images[0]; mainImage.alt = `${product.name}, ${product.description}`;
    document.querySelector('[data-product-whatsapp]').href = root.EleganceCatalog.buildWhatsAppUrl(product.name);
    document.querySelector('[data-gallery-thumbs]').innerHTML = product.images.map((image, index) => `<button type="button" data-gallery-image="${image}" aria-label="View image ${index + 1} of ${product.name}"><img src="${image}" alt=""></button>`).join('');
    document.querySelectorAll('[data-gallery-image]').forEach((button) => button.addEventListener('click', () => { mainImage.src = button.dataset.galleryImage; }));
    related.innerHTML = root.EleganceCatalog.products.filter((item) => item.id !== product.id).slice(0, 4).map(productCardMarkup).join('');
  }

  function init() {
    markActiveNavigation();
    initImageFallbacks();
    renderFeaturedProducts();
    initNewsletter();
    initCatalogFilters();
    renderProductPage();
    initReveal();
  }

  root.EleganceSite = { init };
  document.addEventListener('DOMContentLoaded', init);
}(window));
