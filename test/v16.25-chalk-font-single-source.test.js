const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const fonts=fs.readFileSync(path.join(__dirname,'../src/academy-fonts.css'),'utf8');

test('chalkboard heading uses KG and normal plus small use bundled DJB face only',()=>{
  assert.match(fonts,/font-family:"Academy DJB Chalk";[\s\S]*DJB Chalk It Up\.ttf/);
  assert.match(ux,/academy-text-heading[^`]*Academy KG Sketch/s);
  assert.match(ux,/academy-text-normal[^`]*Academy DJB Chalk/s);
  assert.match(ux,/academy-text-small[^`]*Academy DJB Chalk/s);
  assert.doesNotMatch(ux,/Segoe Print|Comic Sans MS/);
});
