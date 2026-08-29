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

test('board surface does not reuse the composite board-avatar reference image',()=>{
  const block=css.match(/\.stage \.presentation-surface\.presentation-chalkboard\{[\s\S]*?\}/)?.[0]||'';
  assert.ok(block,'chalkboard style block must exist');
  assert.doesNotMatch(block,/academy-tafel-vorlage\.png/);
  assert.match(block,/tafel-academy\.jpg/);
});
