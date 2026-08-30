const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('chalk typography is half size and preserves sketch hatching',()=>{
  assert.match(source,/presentation-chalkboard\.is-visible \.academy-board-object-text\{[^}]*text-shadow:none!important[^}]*filter:none!important/);
  assert.match(source,/academy-text-heading\{font-size:clamp\(11px,1\.025vw,23px\)!important/);
  assert.match(source,/academy-text-normal\{font-size:clamp\(9px,\.775vw,17px\)!important/);
  assert.match(source,/academy-text-small\{font-size:clamp\(7px,\.6vw,14px\)!important/);
});
