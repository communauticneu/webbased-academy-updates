const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('direct UX reapplies KG chalk font to text objects created after font load',()=>{
  assert.match(source,/const applyContextualTextFont=/);
  assert.match(source,/surface\.classList\.contains\('presentation-chalkboard'\)/);
  assert.match(source,/style\.setProperty\('font-family','"KG Second Chances Sketch"','important'\)/);
  assert.match(source,/applyContextualTextFont\(\)/);
});
