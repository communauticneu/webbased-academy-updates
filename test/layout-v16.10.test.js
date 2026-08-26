const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

test('keeps the V16.10 ultrawide layout foundation in later versions', () => {
  assert.match(html, /V16\.10 – Ultrawide Layoutkorrektur/);
});

test('adds the V16.10 ultrawide no-scroll layout rules', () => {
  assert.match(html, /V16\.10 – Ultrawide Layoutkorrektur/);
  assert.match(html, /\.controls\{[^}]*overflow:hidden!important/s);
  assert.match(html, /grid-template-columns:205px minmax\(0,1fr\) 390px!important/);
  assert.match(html, /#vortragView > \.media-library\{[^}]*height:140px!important/s);
});

test('collapses the legacy update panel on ultrawide and keeps the auto updater compact when current', () => {
  assert.match(html, /\.v151-update\{display:none!important\}/);
  assert.match(html, /#academyAutoUpdater\.compact-current/);
  assert.match(html, /classList\.toggle\('compact-current',true\)/);
});

test('keeps production controls and regie panel compact but visible', () => {
  assert.match(html, /\.v160-regie\{[^}]*padding:7px!important/s);
  assert.match(html, /\.controls > \.panel:last-child\{[^}]*min-height:0!important/s);
  assert.match(html, /\.controls textarea\{[^}]*min-height:62px!important/s);
});
