const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('chalk text uses agreed 15 percent larger sizes',()=>{
  assert.match(source,/academy-text-heading[^}]*font-size:39px!important/);
  assert.match(source,/academy-text-normal[^}]*font-size:29px!important/);
  assert.match(source,/academy-text-small[^}]*font-size:23px!important/);
  assert.match(source,/academy-text-heading'\)\)node\.style\.setProperty\('font-size','39px','important'\)/);
});
