const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const drag=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');

test('text frame uses remaining stage width so wrapping follows available space',()=>{
  assert.match(ux,/availableWidth/);
  assert.match(ux,/text\.scrollWidth/);
  assert.match(ux,/white-space:pre-wrap/);
});

test('whole text frame remains clickable and drag suppresses click competition',()=>{
  assert.match(ux,/\.academy-board-object-text\{pointer-events:auto/);
  assert.match(drag,/event\.preventDefault\(\);\s*event\.stopPropagation\(\);\s*event\.stopImmediatePropagation\(\);/);
});
