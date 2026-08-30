const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');

test('Creator reports bundled chalk font runtime state in its title',()=>{
  assert.match(preload,/document\.fonts\.ready/);
  assert.match(preload,/document\.fonts\.check\('24px "KG Second Chances Sketch"'\)/);
  assert.match(preload,/KG FONT: OK/);
  assert.match(preload,/KG FONT: FEHLER/);
});
