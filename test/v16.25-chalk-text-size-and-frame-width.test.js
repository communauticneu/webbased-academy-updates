const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('chalk text uses balanced readable sizes between the previous extremes',()=>{
  assert.match(source,/academy-text-heading'\)\)node\.style\.setProperty\('font-size','34px','important'\)/);
  assert.match(source,/academy-text-normal'\)\)node\.style\.setProperty\('font-size','25px','important'\)/);
  assert.match(source,/academy-text-small'\)\)node\.style\.setProperty\('font-size','20px','important'\)/);
});

test('text selection frame width follows rendered text instead of the original draft width',()=>{
  assert.match(source,/const syncTextFrameWidth=node=>/);
  assert.match(source,/ctx\.measureText/);
  assert.match(source,/node\.style\.setProperty\('width',`\$\{width\}px`,'important'\)/);
  assert.match(source,/syncTextFrameWidth\(node\)/);
});
