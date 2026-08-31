const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('debug: normal and small chalk text retain historical chalk rendering treatment',()=>{
  assert.match(ux,/academy-text-normal[\s\S]*text-shadow:0 0 1px rgba\(255,255,255,\.9\),0 0 3px rgba\(255,255,255,\.22\)!important/);
  assert.match(ux,/academy-text-normal[\s\S]*filter:contrast\(1\.03\)!important/);
  assert.match(ux,/academy-text-normal[\s\S]*letter-spacing:\.01em!important/);
});

test('debug: chalk font ownership is CSS-only and uses bundled aliases',()=>{
  assert.match(ux,/academy-text-heading[\s\S]*font-family:\"Academy KG Sketch\"!important/);
  assert.match(ux,/academy-text-normal[\s\S]*font-family:\"Academy DJB Chalk\"!important/);
  assert.match(ux,/academy-text-small[\s\S]*font-family:\"Academy DJB Chalk\"!important/);
  assert.doesNotMatch(ux,/style\.setProperty\('font-family'/);
  assert.doesNotMatch(ux,/\"Segoe Print\",\"Comic Sans MS\",cursive/);
});
