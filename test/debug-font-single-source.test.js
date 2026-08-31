const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const fonts=fs.readFileSync(path.join(__dirname,'../src/academy-fonts.css'),'utf8');

test('chalk font mapping has exactly one owner',()=>{
  assert.match(fonts,/\.presentation-chalkboard \.academy-board-object-text\.academy-text-heading[^}]*font-family:\s*"Academy KG Sketch"\s*!important/);
  assert.match(fonts,/\.presentation-chalkboard \.academy-board-object-text\.academy-text-normal[^}]*font-family:\s*"Academy DJB Chalk"\s*!important/);
  assert.match(fonts,/\.presentation-chalkboard \.academy-board-object-text\.academy-text-small[^}]*font-family:\s*"Academy DJB Chalk"\s*!important/);
  assert.doesNotMatch(ux,/font-family:\"Academy KG Sketch\"!important/);
  assert.doesNotMatch(ux,/font-family:\"Academy DJB Chalk\"!important/);
  assert.doesNotMatch(ux,/setProperty\(['\"]font-family['\"]/);
});
