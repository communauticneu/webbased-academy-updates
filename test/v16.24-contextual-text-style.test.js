const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('generic Text tool does not force the chalkboard visible',()=>{
  assert.match(editor,/data-board-object="text">[^<]*Text<\/button>/,'toolbar must expose a generic Text button');
  assert.doesNotMatch(editor,/function add\([^)]*\)[\s\S]*?classList\.add\('presentation-chalkboard','is-visible'\)/,'adding an object must not force the chalkboard visible');
});

test('text styling follows the active presentation medium without changing the object type',()=>{
  assert.match(editor,/\.academy-board-object-text\{[^}]*font-family:Arial/,'no active medium must use standard Arial text');
  assert.match(editor,/\.presentation-chalkboard \.academy-board-object-text\{[^}]*DJB Chalk It Up/,'chalkboard must apply chalk styling to the same text object');
  assert.doesNotMatch(editor,/type:'chalktext'/,'text must remain one reusable object type');
});
