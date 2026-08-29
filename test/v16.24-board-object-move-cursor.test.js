const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('movable board objects show the standard four-way move cursor',()=>{
  assert.match(editor,/\.academy-board-object\{[^}]*cursor:move/,'board objects must visibly advertise free movement');
  assert.match(editor,/\.academy-board-resize-handle\{[^}]*cursor:nwse-resize/,'resize handle must keep its distinct resize cursor');
});
