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

test('board surface stays dark and does not reuse old image-based board paths',()=>{
  const block=css.match(/\.stage \.presentation-surface\.presentation-chalkboard\{[\s\S]*?\}/)?.[0]||'';
  assert.ok(block,'chalkboard style block must exist');
  assert.match(block,/background-color:#1b2422/);
  assert.match(block,/radial-gradient/);
  assert.doesNotMatch(block,/academy-tafel-vorlage\.png/);
  assert.doesNotMatch(block,/tafel-academy\.jpg/);
});
