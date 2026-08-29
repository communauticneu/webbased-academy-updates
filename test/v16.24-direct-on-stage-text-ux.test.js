const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');
const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');
const medium=fs.readFileSync(path.join(__dirname,'../src/presentation-medium-selection.js'),'utf8');

test('text button only creates text; editing and deletion live on stage',()=>{
  assert.doesNotMatch(editor,/academy-board-content-field/,'right-side content editor must be removed');
  assert.doesNotMatch(editor,/data-board-delete/,'right-side delete button must be removed');
  assert.match(editor,/academy-board-object-delete/,'selected text needs an on-stage delete control');
  assert.match(interaction,/dblclick/,'text must enter direct editing on double click');
  assert.match(interaction,/contentEditable/,'direct editing must happen inside the text object');
});

test('active chalkboard button toggles the board off again',()=>{
  assert.match(medium,/setAcademyBoardVisible\(doc,false\)/,'second click on active chalkboard must hide it');
});
