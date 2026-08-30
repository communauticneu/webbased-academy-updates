const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const stage=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');
const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('text drag persists its final frame directly into the editor model',()=>{
  assert.match(stage,/AcademyPresentationObjectEditor\?\.persistFrame\?\.\(doc,drag\.node\.dataset\.objectId,values\)/);
  assert.doesNotMatch(stage,/data-prop=|dispatchEvent\(new Event\('input'/);
  assert.match(editor,/function persistFrame\(doc,id,patch\)/);
  assert.match(editor,/objects\[i\]=updateObject\(objects\[i\],patch\)/);
});
