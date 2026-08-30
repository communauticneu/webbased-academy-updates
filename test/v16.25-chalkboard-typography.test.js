const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('chalkboard typography selects KG Second Chances Sketch when available',()=>{
  assert.match(editor,/\.presentation-chalkboard \.academy-board-object-text\{[^}]*font-family:"KG Second Chances Sketch"/);
});

test('chalkboard heading and normal text are smaller than generic room text',()=>{
  assert.match(editor,/\.presentation-chalkboard \.academy-board-object-text\.academy-text-heading\{font-size:clamp\(22px,2\.05vw,46px\)!important/);
  assert.match(editor,/\.presentation-chalkboard \.academy-board-object-text\.academy-text-normal\{font-size:clamp\(17px,1\.55vw,34px\)!important/);
});
