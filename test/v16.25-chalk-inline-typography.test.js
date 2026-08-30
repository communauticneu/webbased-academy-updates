const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('live chalk text receives explicit reduced typography independent of CSS cascade',()=>{
  assert.match(source,/academy-text-heading[^\n]*23px/);
  assert.match(source,/academy-text-normal[^\n]*17px/);
  assert.match(source,/academy-text-small[^\n]*14px/);
  assert.match(source,/node\.style\.setProperty\('font-size'/);
  assert.match(source,/node\.style\.setProperty\('text-shadow','none','important'\)/);
  assert.match(source,/node\.style\.setProperty\('filter','none','important'\)/);
  assert.match(source,/node\.style\.removeProperty\('font-size'\)/);
});
