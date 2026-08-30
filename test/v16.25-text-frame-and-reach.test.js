const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('text objects can reach the full presentation surface including top-left',()=>{
  assert.match(ux,/\.academy-board-object-layer\{[^}]*inset:0!important/);
});

test('single-line text frame does not reserve two-line height',()=>{
  assert.doesNotMatch(ux,/academy-text-heading\{min-height:2\.4em!important/);
  assert.doesNotMatch(ux,/academy-text-normal\{min-height:2\.15em!important/);
  assert.match(ux,/\.academy-board-object-text\{[^}]*min-height:1\.15em!important/);
});

test('text frame height follows rendered content',()=>{
  assert.match(ux,/const syncFrame=node=>/);
  assert.match(ux,/scrollHeight/);
});
