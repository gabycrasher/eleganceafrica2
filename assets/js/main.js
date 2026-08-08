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
