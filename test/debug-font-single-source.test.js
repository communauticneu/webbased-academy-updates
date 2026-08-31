const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('chalk text font ownership stays in CSS, not interaction inline styles',()=>{
  assert.match(ux,/academy-text-heading[^`]*font-family:\"Academy KG Sketch\"!important/);
  assert.match(ux,/academy-text-normal[^`]*font-family:\"Academy DJB Chalk\"!important/);
  assert.match(ux,/academy-text-small[^`]*font-family:\"Academy DJB Chalk\"!important/);
  assert.doesNotMatch(ux,/setProperty\(['\"]font-family['\"]/);
  assert.doesNotMatch(ux,/setProperty\(['\"]font-size['\"]/);
});
