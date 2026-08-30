const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

test('chalkboard normal text applies the bundled sketch font explicitly to the text span at 25px',()=>{
  const source=fs.readFileSync(path.join(__dirname,'..','src','presentation-text-direct-ux.js'),'utf8');
  assert.match(source,/academy-text-normal span\{font-family:\"Academy KG Sketch\"!important;font-size:25px!important/);
  assert.match(source,/querySelector\?\.\('span'\)/);
  assert.match(source,/text\.style\.setProperty\('font-family','\"Academy KG Sketch\"','important'\)/);
  assert.match(source,/text\.style\.setProperty\('font-size','25px','important'\)/);
});
