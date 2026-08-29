const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

test('keeps the readable Creator controls while allowing the current version to advance', () => {
  assert.match(pkg.version, /^0\.16\.(?:1[1-9]|[2-9]\d)$/);
});

test('right control typography meets readable minimums', () => {
  assert.match(html, /\.controls > \.panel h2\{[^}]*font-size:16px!important/s);
  assert.match(html, /\.controls label\{[^}]*font-size:14px!important/s);
  assert.match(html, /\.controls select,\.controls input,\.controls textarea\{[^}]*font-size:14px!important/s);
  assert.match(html, /\.controls \.btn\{[^}]*font-size:14px!important/s);
  assert.match(html, /\.v169-status\{[^}]*font-size:14px!important/s);
  assert.match(html, /\.v160-phase\{[^}]*font-size:14px!important/s);
});

test('scene list and media library are readable', () => {
  assert.match(html, /\.scenecol h2\{[^}]*font-size:16px!important/s);
  assert.match(html, /\.scene \.t\{[^}]*font-size:14px!important/s);
  assert.match(html, /\.media-library h2\{[^}]*font-size:16px!important/s);
  assert.match(html, /\.media-library \.name\{[^}]*font-size:14px!important/s);
  assert.match(html, /\.media-library \.dropzone\{[^}]*font-size:14px!important/s);
});

test('update current state remains compact and Schultafel heading is readable', () => {
  assert.match(html, /#academyAutoUpdater\.compact-current/);
  assert.match(html, /\.tafel-card strong\{[^}]*font-size:16px!important/s);
});
