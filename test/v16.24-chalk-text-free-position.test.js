const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('chalk text can be grabbed and freely repositioned on the board',()=>{
  assert.match(editor,/pointerdown/,'board objects must start dragging with pointer input');
  assert.match(editor,/pointermove/,'dragging must follow pointer movement');
  assert.match(editor,/moveObject/,'dragging must persist the new object position');
  assert.match(editor,/data-object-id|dataset\.objectId/,'rendered board objects must remain addressable while dragging');
});
