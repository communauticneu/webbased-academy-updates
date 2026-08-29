const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('generic Text tool does not force the chalkboard visible',()=>{
  assert.match(editor,/data-board-object="text">[^<]*Text<\/button>/,'toolbar must expose a generic Text button');
  assert.doesNotMatch(editor,/function add\([^)]*\)[\s\S]*?classList\.add\('presentation-chalkboard','is-visible'\)/,'adding an object must not force the chalkboard visible');
});

test('new text picks its visual style from the active presentation medium',()=>{
  assert.match(editor,/function activeTextStyle\(/,'editor must resolve a text style from the active medium');
  assert.match(editor,/presentationMedium==='chalkboard'[^\n]*'chalk'/,'chalkboard must map to chalk text');
  assert.match(editor,/return 'standard'/,'no active medium must fall back to standard text');
  assert.match(editor,/academy-board-object-text-standard/,'standard text style must exist');
  assert.match(editor,/academy-board-object-text-chalk/,'chalk text style must exist');
});