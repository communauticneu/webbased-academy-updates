const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('generic Text tool does not force the chalkboard visible',()=>{
  assert.match(editor,/data-text-tool[^>]*>[^<]*Text<\/button>/,'toolbar must expose a generic Text button');
  assert.doesNotMatch(editor,/function add\([^)]*\)[\s\S]*?classList\.add\('presentation-chalkboard','is-visible'\)/,'adding an object must not force the chalkboard visible');
});

test('text styling follows the active presentation medium without changing the object type',()=>{
  assert.match(editor,/\.academy-board-object-text\{[^}]*font-family:Arial/,'no active medium must use standard Arial text');
  assert.match(ux,/academy-text-heading[\s\S]*Academy KG Sketch/,'chalkboard heading must use approved KG alias');
  assert.match(ux,/academy-text-normal[\s\S]*Academy DJB Chalk/,'chalkboard normal text must use approved DJB alias');
  assert.match(ux,/academy-text-small[\s\S]*Academy DJB Chalk/,'chalkboard small text must use approved DJB alias');
  assert.match(ux,/const boardActive=.*presentation-chalkboard.*is-visible/s,'chalk styling must follow the real visible board state');
  assert.doesNotMatch(editor,/type:'chalktext'/,'text must remain one reusable object type');
});
