const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const fonts=fs.readFileSync(path.join(__dirname,'../src/academy-fonts.css'),'utf8');

test('debug: normal and small chalk text retain historical chalk rendering treatment',()=>{
  assert.match(ux,/academy-text-normal[\s\S]*text-shadow:0 0 1px rgba\(255,255,255,\.9\),0 0 3px rgba\(255,255,255,\.22\)!important/);
  assert.match(ux,/academy-text-normal[\s\S]*filter:contrast\(1\.03\)!important/);
  assert.match(ux,/academy-text-normal[\s\S]*letter-spacing:\.01em!important/);
  assert.match(ux,/academy-text-small[\s\S]*text-shadow:0 0 1px rgba\(255,255,255,\.9\),0 0 3px rgba\(255,255,255,\.22\)!important/);
});

test('debug: bundled chalk font mapping lives only in academy-fonts.css',()=>{
  assert.match(fonts,/academy-text-heading[\s\S]*font-family:\s*"Academy KG Sketch"\s*!important/);
  assert.match(fonts,/academy-text-normal[\s\S]*font-family:\s*"Academy DJB Chalk"\s*!important/);
  assert.match(fonts,/academy-text-small[\s\S]*font-family:\s*"Academy DJB Chalk"\s*!important/);
  assert.doesNotMatch(ux,/font-family:\"Academy KG Sketch\"!important/);
  assert.doesNotMatch(ux,/font-family:\"Academy DJB Chalk\"!important/);
  assert.doesNotMatch(ux,/setProperty\(['\"]font-family['\"]/);
  assert.doesNotMatch(ux,/\"Segoe Print\",\"Comic Sans MS\",cursive/);
});
