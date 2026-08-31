const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('chalk text font ownership stays in the object editor CSS only',()=>{
  assert.match(editor,/presentation-chalkboard[^']*academy-text-heading[^']*font-family:\"Academy KG Sketch\"!important/);
  assert.match(editor,/presentation-chalkboard[^']*academy-text-normal[^']*font-family:\"Academy DJB Chalk\"!important/);
  assert.match(editor,/presentation-chalkboard[^']*academy-text-small[^']*font-family:\"Academy DJB Chalk\"!important/);
  assert.doesNotMatch(ux,/font-family:\"Academy KG Sketch\"!important/);
  assert.doesNotMatch(ux,/font-family:\"Academy DJB Chalk\"!important/);
  assert.doesNotMatch(ux,/setProperty\(['\"]font-family['\"]/);
  assert.doesNotMatch(ux,/setProperty\(['\"]font-size['\"]/);
});
