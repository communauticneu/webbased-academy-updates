const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');

test('keeps the auto updater compact when current', () => {
  assert.match(html, /\.v151-update\{display:none!important\}/);
  assert.match(html, /#academyAutoUpdater\.compact-current/);
  assert.match(html, /classList\.toggle\('compact-current',true\)/);
});

test('keeps production controls and regie panel compact but visible', () => {
  assert.match(html, /\.v160-regie\{[^}]*padding:7px!important/s);
  assert.match(html, /\.controls > \.panel:last-child\{[^}]*min-height:0!important/s);
  assert.match(html, /\.controls textarea\{[^}]*min-height:62px!important/s);
});
