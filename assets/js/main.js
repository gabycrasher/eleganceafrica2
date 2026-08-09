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
    return `<article class="col-12 col-md-6 col-xl-3"><a class="product-card" href="products/${encodeURIComponent(product.id)}.html"><span class="product-card__media"><img src="${product.images[0]}" alt="${product.name}, ${product.description}" loading="lazy"></span><span class="product-card__meta"><small>${product.category}</small><strong>${product.name}</strong><span>${product.price}</span></span></a></article>`;
  }

  function renderFeaturedProducts() {
    const grid = document.querySelector('[data-featured-grid]');
    if (!grid || !root.EleganceCatalog) return;
    grid.innerHTML = root.EleganceCatalog.products.filter((product) => product.featured).slice(0, 4).map(productCardMarkup).join('');
  }

  function initSignatureQuiz() {
    const quiz = document.querySelector('[data-signature-quiz]');
    if (!quiz || !root.EleganceCatalog) return;
    const form = quiz.querySelector('form'); const steps = [...quiz.querySelectorAll('[data-quiz-step]')]; const result = quiz.querySelector('[data-quiz-result]'); let activeStep = 0;
    function showStep(index, moveFocus = false) { activeStep = index; steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== index; }); quiz.querySelectorAll('.quiz-progress span').forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex <= index)); if (moveFocus) { const legend = steps[index].querySelector('legend'); legend.tabIndex = -1; legend.focus(); } }
    quiz.querySelectorAll('[data-quiz-next]').forEach((button) => button.addEventListener('click', () => { if (!steps[activeStep].querySelector('input:checked')) { steps[activeStep].querySelector('input')?.focus(); return; } showStep(activeStep + 1, true); }));
    quiz.querySelectorAll('[data-quiz-back]').forEach((button) => button.addEventListener('click', () => showStep(activeStep - 1, true)));
    form.addEventListener('submit', (event) => { event.preventDefault(); const product = root.EleganceCatalog.recommendProduct(Object.fromEntries(new FormData(form).entries())); result.innerHTML = `<p class="eyebrow">Your signature</p><h3>${product.name}</h3><p>${product.description}</p><a class="btn btn-gold" href="products/${encodeURIComponent(product.id)}.html">View ${product.name}</a>`; form.hidden = true; result.hidden = false; });
    showStep(0);
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
    if (!product) { resetProductMetadata(); view.hidden = true; missing.hidden = false; related.innerHTML = root.EleganceCatalog.products.slice(0, 4).map(productCardMarkup).join(''); return; }
    view.hidden = false; document.title = `${product.name} | Elegance Africa`;
    updateProductMetadata(product);
    document.querySelector('[data-product-name]').textContent = product.name;
    document.querySelector('[data-product-price]').textContent = product.price;
    document.querySelector('[data-product-description]').textContent = product.description;
    document.querySelector('[data-product-availability]').textContent = product.availability;
    document.querySelector('[data-product-care]').textContent = product.care;
    const selectorTemplate = document.querySelector('[data-product-selector-template]');
    document.querySelector('[data-product-description]').after(selectorTemplate.content.cloneNode(true));
    document.querySelector('[data-product-style]').textContent = product.wearItHow;
    const mainImage = document.querySelector('[data-gallery-main]'); mainImage.src = product.images[0]; mainImage.alt = `${product.name}, ${product.description}`;
    const length = document.querySelector('[data-product-length]'); const density = document.querySelector('[data-product-density]');
    length.innerHTML = '<option value="">Not selected</option>' + product.lengths.map((option) => `<option value="${option}">${option}</option>`).join('');
    density.innerHTML = '<option value="">Not selected</option>' + product.densities.map((option) => `<option value="${option}">${option}</option>`).join('');
    function updateEnquiry() { document.querySelector('[data-product-whatsapp]').href = root.EleganceCatalog.buildWhatsAppUrl(product.name, selectedProductOptions()); }
    length.addEventListener('change', updateEnquiry); density.addEventListener('change', updateEnquiry); updateEnquiry();
    document.querySelector('[data-gallery-thumbs]').innerHTML = product.images.map((image, index) => `<button type="button" data-gallery-image="${image}" aria-label="View image ${index + 1} of ${product.name}"><img src="${image}" alt=""></button>`).join('');
    document.querySelectorAll('[data-gallery-image]').forEach((button) => button.addEventListener('click', () => { mainImage.src = button.dataset.galleryImage; }));
    related.innerHTML = root.EleganceCatalog.products.filter((item) => item.id !== product.id).slice(0, 4).map(productCardMarkup).join('');
  }

  function updateProductMetadata(product) {
    const canonical = `product.html?id=${encodeURIComponent(product.id)}`;
    const setContent = (selector, content) => { const element = document.querySelector(selector); if (element) element.setAttribute('content', content); };
    document.querySelector('[data-product-canonical]')?.setAttribute('href', canonical);
    setContent('meta[name="description"]', product.description);
    setContent('[data-product-og-title]', `${product.name} | Elegance Africa`);
    setContent('[data-product-og-description]', product.description);
    setContent('[data-product-og-image]', product.images[0]);
    setContent('[data-product-og-url]', canonical);
    const schema = document.querySelector('[data-product-schema]');
    if (schema) schema.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: product.name, image: product.images,
      description: product.description, brand: { '@type': 'Organization', name: 'Elegance Africa' }
    }).replace(/</g, '\\u003c');
  }

  function resetProductMetadata() {
    const description = 'View the selected Elegance Africa hair piece and ask about price and availability.';
    const setContent = (selector, content) => { const element = document.querySelector(selector); if (element) element.setAttribute('content', content); };
    document.title = 'Product Details | Elegance Africa';
    document.querySelector('[data-product-canonical]')?.setAttribute('href', 'product.html');
    setContent('meta[name="description"]', description);
    setContent('[data-product-og-title]', 'Product Details | Elegance Africa');
    setContent('[data-product-og-description]', description);
    setContent('[data-product-og-image]', 'assets/images/nia-wave-3.jpeg');
    setContent('[data-product-og-url]', 'product.html');
    setContent('[data-product-og-type]', 'website');
    document.querySelector('[data-product-schema]')?.remove();
  }

  function selectedProductOptions() {
    return { length: document.querySelector('[data-product-length]')?.value || '', density: document.querySelector('[data-product-density]')?.value || '' };
  }

  function initStaticProductEnquiry() {
    const productId = document.body.dataset.productId;
    const link = document.querySelector('[data-static-product-whatsapp]');
    if (!productId || !link || !root.EleganceCatalog) return;
    const product = root.EleganceCatalog.getProductById(productId);
    if (!product) return;
    const length = document.querySelector('[data-product-length]');
    const density = document.querySelector('[data-product-density]');
    function updateEnquiry() {
      link.href = root.EleganceCatalog.buildWhatsAppUrl(product.name, {
        length: length?.value || '', density: density?.value || ''
      });
    }
    length?.addEventListener('change', updateEnquiry);
    density?.addEventListener('change', updateEnquiry);
    updateEnquiry();
  }

  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.classList.add('was-validated'); status.textContent = 'Please complete the required fields.'; return; }
      const values = Object.fromEntries(new FormData(form).entries());
      const subject = `Elegance Africa enquiry: ${values.interest}`;
      const body = `Name: ${values.name}\nEmail: ${values.email}\nPhone/WhatsApp: ${values.phone || 'Not provided'}\nInterest: ${values.interest}\n\n${values.message}`;
      status.textContent = 'Your email application is opening with the enquiry prepared.';
      root.location.href = `mailto:eeleganceafrica@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  function initMotionSystem() {
    document.documentElement.classList.add('motion-safe');
    const progress = document.querySelector('[data-scroll-progress] span');
    const header = document.querySelector('.site-header');
    if (progress || header) {
      const update = () => {
        const max = Math.max(1, document.documentElement.scrollHeight - root.innerHeight);
        if (progress) progress.style.transform = `scaleX(${Math.min(1, root.scrollY / max)})`;
        header?.classList.toggle('is-scrolled', root.scrollY > 16);
      };
      root.addEventListener('scroll', update, { passive: true }); update();
    }
  }

  function initMobileNavigation() {
    const menu = document.querySelector('#siteMenu');
    const toggle = document.querySelector('[data-bs-target="#siteMenu"]');
    if (!menu || !toggle) return;
    function toggleMobileMenu(open) {
      menu.classList.toggle('mobile-menu-open', open);
      document.body.classList.toggle('menu-is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }
    toggle.addEventListener('click', (event) => {
      if (root.bootstrap?.Offcanvas) return;
      event.preventDefault();
      toggleMobileMenu(!menu.classList.contains('mobile-menu-open'));
    });
    menu.querySelector('[data-bs-dismiss="offcanvas"]')?.addEventListener('click', () => toggleMobileMenu(false));
    menu.querySelectorAll('a[href]').forEach((link) => link.addEventListener('click', () => {
      if (root.matchMedia('(max-width: 991.98px)').matches) {
        if (root.bootstrap?.Offcanvas) root.bootstrap.Offcanvas.getOrCreateInstance(menu).hide();
        toggleMobileMenu(false);
      }
    }));
  }

  function initInspirationRail() {
    const rail = document.querySelector('[data-inspiration-rail]');
    const track = document.querySelector('[data-inspiration-track]');
    if (!rail || !track || !root.EleganceCatalog) return;
    track.innerHTML = root.EleganceCatalog.products.map((product) => `<a class="inspiration-card" href="${product.staticPath}"><img src="${product.images[0]}" alt="${product.name}" loading="lazy"><span>${product.name.replace('The ', '')}</span></a>`).join('');
    const step = () => Math.max(240, track.clientWidth * .72);
    rail.querySelector('[data-rail-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    rail.querySelector('[data-rail-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  function initRecentlyViewed() {
    const section = document.querySelector('[data-recently-viewed]');
    const productId = new URLSearchParams(location.search).get('id');
    if (!section || !productId || !root.EleganceCatalog) return;
    try {
      const key = 'elegance-africa-recent-products';
      const ids = JSON.parse(root.localStorage.getItem(key) || '[]').filter((id) => id !== productId);
      ids.unshift(productId); root.localStorage.setItem(key, JSON.stringify(ids.slice(0, 4)));
      const products = ids.slice(1).map(root.EleganceCatalog.getProductById).filter(Boolean);
      if (!products.length) return;
      section.hidden = false;
      section.querySelector('[data-recently-viewed-grid]').innerHTML = products.map(productCardMarkup).join('');
    } catch (_) { /* Storage is optional; the page remains fully usable. */ }
  }

  function init() {
    document.documentElement.classList.add('js-ready');
    markActiveNavigation();
    initImageFallbacks();
    renderFeaturedProducts();
    initSignatureQuiz();
    initNewsletter();
    initCatalogFilters();
    renderProductPage();
    initStaticProductEnquiry();
    initContactForm();
    initReveal();
    initMotionSystem();
    initMobileNavigation();
    initInspirationRail();
    initRecentlyViewed();
  }

  root.EleganceSite = { init, initSignatureQuiz, renderProductPage, initStaticProductEnquiry };
  document.addEventListener('DOMContentLoaded', init);
}(window));
