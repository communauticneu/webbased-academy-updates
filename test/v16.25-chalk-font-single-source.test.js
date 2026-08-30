const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('chalkboard heading uses Academy KG Sketch and normal uses DJB Chalk It Up only',()=>{
  assert.match(ux,/academy-text-heading[^`]*Academy KG Sketch/s);
  assert.match(ux,/academy-text-normal[^`]*DJB Chalk It Up/s);
  assert.doesNotMatch(ux,/Segoe Print|Comic Sans MS/);
});
