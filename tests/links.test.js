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
