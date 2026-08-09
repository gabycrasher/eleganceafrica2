const assert = require('node:assert/strict');
const { existsSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

test('hosting build places the static entry page in the client asset directory', () => {
  const root = path.resolve(__dirname, '..');

  execFileSync('powershell.exe', [
    '-NoProfile',
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    path.join(root, 'scripts', 'build-static-site.ps1'),
  ], { cwd: root, stdio: 'pipe' });

  assert.equal(existsSync(path.join(root, 'dist', 'client', 'index.html')), true);
  assert.equal(existsSync(path.join(root, 'dist', 'client', 'assets', 'css', 'styles.css')), true);
  assert.equal(existsSync(path.join(root, 'dist', 'server', 'index.js')), true);
});
