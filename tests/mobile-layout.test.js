const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const css = fs.readFileSync('assets/css/styles.css', 'utf8');
const script = fs.readFileSync('assets/js/main.js', 'utf8');

test('mobile styles prevent horizontal overflow and turn the inspiration rail into a vertical edit', () => {
  assert.match(css, /html, body\s*\{[^}]*overflow-x:\s*clip/i);
  assert.match(css, /@media \(max-width: 991\.98px\)[\s\S]*?\.inspiration-track\s*\{[^}]*grid-template-columns:\s*1fr/i);
  assert.match(css, /@media \(max-width: 991\.98px\)[\s\S]*?\.rail-controls\s*\{[^}]*display:\s*none/i);
});

test('mobile navigation has a visible touch-friendly toggler and closes after navigation', () => {
  assert.match(css, /\.navbar-toggler\s*\{[^}]*min-height:\s*44px/i);
  assert.match(css, /\.navbar-toggler-icon\s*\{[^}]*background-image/i);
  assert.match(css, /\.offcanvas\.offcanvas-end\s*\{[^}]*width:\s*min\(88vw, 23rem\)/i);
  assert.match(script, /function initMobileNavigation\(/);
  assert.match(script, /bootstrap\.Offcanvas\.getOrCreateInstance/);
});

test('mobile navigation remains usable when Bootstrap is unavailable', () => {
  assert.match(script, /function toggleMobileMenu\(/);
  assert.match(script, /mobile-menu-open/);
  assert.match(css, /\.offcanvas\.mobile-menu-open\s*\{[^}]*transform:\s*translateX\(0\)/i);
  assert.match(css, /\.site-header\s*\{[^}]*border-bottom:\s*0/i);
  assert.match(script, /event\.stopImmediatePropagation\(\)/);
  assert.match(css, /\.offcanvas\.mobile-menu-open\s*\{[^}]*display:\s*flex\s*!important/i);
  assert.match(css, /\.offcanvas\.mobile-menu-open\s*\{[^}]*z-index:\s*2000/i);
});

test('responsive navigation provides separate desktop and mobile navigation surfaces', () => {
  assert.match(script, /function initDesktopNavigation\(/);
  assert.match(script, /desktop-navigation/);
  assert.match(css, /\.desktop-navigation\s*\{[^}]*display:\s*none/i);
  assert.match(css, /@media \(min-width: 992px\)[\s\S]*?\.desktop-navigation\s*\{[^}]*display:\s*flex/i);
});

test('opened mobile navigation renders its full-height link list', () => {
  assert.match(css, /#siteMenu\.mobile-menu-open\s+\.offcanvas-body\s*\{[^}]*flex:\s*1/i);
  assert.match(css, /#siteMenu\.mobile-menu-open\s+\.navbar-nav\s*\{[^}]*display:\s*flex\s*!important/i);
  assert.match(css, /#siteMenu\.mobile-menu-open\s+\.nav-link\s*\{[^}]*display:\s*block\s*!important/i);
});
