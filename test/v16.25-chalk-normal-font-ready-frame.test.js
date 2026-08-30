const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','src','presentation-text-direct-ux.js'),'utf8');

test('chalk normal waits for bundled font before final frame measurement',()=>{
  assert.match(source,/doc\.fonts\?\.load\?\.\('25px \"Academy KG Sketch\"'/);
  assert.match(source,/doc\.fonts\?\.ready/);
  assert.match(source,/setTimeout\(\(\)=>\{syncFont\(\);layer\.querySelectorAll\?\.\('\.academy-board-object-text\[data-object-id\]'\)\?\.forEach\(syncFrame\);\},0\)/);
});

test('chalk normal applies the bundled sketch font directly to its text span',()=>{
  assert.match(source,/academy-text-normal span\{font-family:\"Academy KG Sketch\"!important/);
  assert.match(source,/academy-text-normal span\{[^}]*font-size:25px!important/);
});

test('text frame allows breathing room after measuring natural width',()=>{
  assert.match(source,/Math\.ceil\(text\.scrollWidth\+20\)/);
});
