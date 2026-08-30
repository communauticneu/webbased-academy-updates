const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('double click edits the selected text directly on stage',()=>{
  assert.match(ux,/addEventListener\('dblclick'/,'direct text UX needs a double-click edit interaction');
  assert.match(ux,/beginDirectTextEdit\?\.\(doc,node\)/,'double-click editing must delegate to the editor model');
  assert.match(editor,/contentEditable='true'/,'editor model must make the existing text content editable');
  assert.match(editor,/textContent/,'editor model must write the changed text back to the same object');
});

test('selected text can be deleted with button and Delete key',()=>{
  assert.match(ux,/Text löschen/,'selected text needs a visible delete action');
  assert.match(editor,/keydown/,'editor must listen for keyboard deletion');
  assert.match(editor,/Delete/,'Delete key must remove the selected object');
});
