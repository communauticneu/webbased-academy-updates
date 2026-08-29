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

test('board surface uses the supplied 4K original with a soft right edge',()=>{
  const block=css.match(/\.stage \.presentation-surface\.presentation-chalkboard\{[\s\S]*?\}/)?.[0]||'';
  assert.ok(block,'chalkboard style block must exist');
  assert.match(block,/background-image:url\('assets\/academy-tafel-oberflaeche\.png'\)!important/);
  assert.match(block,/background-size:cover!important/);
  assert.match(block,/background-position:center center!important/);
  assert.match(block,/mask-image:linear-gradient\(to right,#000 0%,#000 84%,transparent 100%\)!important/);
  assert.doesNotMatch(block,/academy-tafel-vorlage\.png/);
  assert.doesNotMatch(block,/academy-tafel-original-crop\.svg/);
  assert.doesNotMatch(block,/radial-gradient/);
  assert.doesNotMatch(block,/tafel-academy\.jpg/);
});
