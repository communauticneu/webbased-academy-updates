const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const directUx=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const editor=require('../src/presentation-object-editor');

test('direct text editing delegates to the editor model and never clicks the sidebar row',()=>{
  assert.match(directUx,/beginDirectTextEdit\?\.\(doc,node\)/,'editing must use the existing object instead of reselecting it through the sidebar');
  assert.doesNotMatch(directUx,/\[data-list-id=/,'direct editing must not look up a sidebar row');
  assert.doesNotMatch(directUx,/row\?\.click/,'direct editing must not simulate a sidebar click');
});

test('text object list stays inside the sidebar without a horizontal scrollbar',()=>{
  const css=editor.editorStyles();
  assert.match(css,/\.academy-board-object-list\{[^}]*overflow:hidden/);
  assert.doesNotMatch(css,/\.academy-board-object-list\{[^}]*overflow-x:auto/);
  assert.match(css,/\.academy-board-object-row\{[^}]*min-width:0/);
});

test('obsolete direct-edit helper text is removed from the header',()=>{
  assert.doesNotMatch(editor.editorMarkup(),/Direkt in der Darstellung bearbeiten/);
});
