const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'../src/presentation-stage-v16.17.css'),'utf8');
const boardAsset=fs.readFileSync(path.join(__dirname,'../src/assets/academy-tafel-flaeche.svg'),'utf8');

test('chalkboard remains flat without reintroducing perspective geometry',()=>{
  assert.doesNotMatch(css,/perspective\(/);
  assert.doesNotMatch(css,/rotateY\(/);
  assert.doesNotMatch(css,/clip-path\s*:/);
});

test('board surface uses only the clean board-only crop of the supplied reference',()=>{
  const block=css.match(/\.stage \.presentation-surface\.presentation-chalkboard\{[\s\S]*?\}/)?.[0]||'';
  assert.ok(block,'chalkboard style block must exist');
  assert.match(block,/background-image:url\('assets\/academy-tafel-flaeche\.svg'\)!important/);
  assert.match(block,/background-size:cover!important/);
  assert.doesNotMatch(block,/academy-tafel-vorlage\.png/);
  assert.doesNotMatch(block,/radial-gradient/);
  assert.doesNotMatch(block,/linear-gradient/);
  assert.doesNotMatch(block,/tafel-academy\.jpg/);
});

test('clean board crop keeps high-resolution source detail',()=>{
  assert.match(boardAsset,/viewBox="0 0 900 800"/);
  assert.match(boardAsset,/<image width="900" height="800"/);
  assert.doesNotMatch(boardAsset,/viewBox="0 0 240 210"/);
});
