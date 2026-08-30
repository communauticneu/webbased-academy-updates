const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('chalkboard heading normal and small use only Academy KG Sketch',()=>{
  assert.match(ux,/academy-text-heading[^`]*Academy KG Sketch/s);
  assert.match(ux,/academy-text-normal[^`]*Academy KG Sketch/s);
  assert.doesNotMatch(ux,/DJB Chalk It Up|Segoe Print|Comic Sans MS/);
});
