const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const helperPath=path.join(__dirname,'../src/presentation-text-direct-ux.js');
const helper=fs.existsSync(helperPath)?fs.readFileSync(helperPath,'utf8'):'';
const medium=fs.readFileSync(path.join(__dirname,'../src/presentation-medium-selection.js'),'utf8');
const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');

test('text button only creates text; editing and deletion live on stage',()=>{
  assert.match(preload,/presentation-text-direct-ux\.js/,'direct text UX helper must load after the editor');
  assert.match(helper,/academy-board-content-field/,'right-side content editor must be hidden by direct UX');
  assert.match(helper,/data-board-delete/,'legacy delete action may only be used internally');
  assert.match(helper,/academy-board-object-delete/,'selected text needs an on-stage delete control');
  assert.match(helper,/dblclick/,'text must enter direct editing on double click');
  assert.match(helper,/contentEditable/,'direct editing must happen inside the text object');
});

test('active chalkboard button toggles the board off again',()=>{
  assert.match(medium,/setAcademyBoardVisible\(doc,false\)/,'second click on active chalkboard must hide it');
});
