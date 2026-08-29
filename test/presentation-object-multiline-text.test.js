const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('chalk text properties use a compact two-line textarea',()=>{
  assert.match(editor,/<textarea[^>]*data-prop="content"[^>]*rows="2"[^>]*><\/textarea>/,'chalk text content must use a two-line textarea');
  assert.doesNotMatch(editor,/academy-board-content-field">Inhalt<input data-prop="content">/,'single-line content input must be removed');
});
