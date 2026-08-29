const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'../src/presentation-stage-v16.17.css'),'utf8');

test('chalkboard remains flat without reintroducing perspective geometry',()=>{
  assert.doesNotMatch(css,/perspective\(/);
  assert.doesNotMatch(css,/rotateY\(/);
  assert.doesNotMatch(css,/clip-path\s*:/);
});

test('board surface uses only a clean crop of the supplied Academy board artwork',()=>{
  const block=css.match(/\.stage \.presentation-surface\.presentation-chalkboard\{[\s\S]*?\}/)?.[0]||'';
  assert.ok(block,'chalkboard style block must exist');
  assert.match(block,/background-image:url\('assets\/academy-tafel-vorlage\.png'\)!important/);
  assert.match(block,/background-size:185% 125%!important/);
  assert.match(block,/background-position:left bottom!important/);
  assert.doesNotMatch(block,/radial-gradient/);
  assert.doesNotMatch(block,/linear-gradient/);
  assert.doesNotMatch(block,/tafel-academy\.jpg/);
});
