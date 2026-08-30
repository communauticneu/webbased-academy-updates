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

test('created objects are hidden from the tool menu instead of repeated as rows',()=>{
  assert.match(directUx,/\.academy-board-object-list\{[^}]*display:none!important/);
});

test('text variants read as a subordinate Textart panel',()=>{
  assert.match(directUx,/\.academy-text-kind-menu\{[^}]*position:relative/);
  assert.match(directUx,/\.academy-text-kind-menu::before\{[^}]*content:"Textart"/);
  assert.match(directUx,/\.academy-text-kind-menu\{[^}]*margin-left:/);
  assert.match(directUx,/\.academy-text-kind-menu button\{[^}]*min-height:/);
});

test('text frames contain visible text, stay clickable and adapt their height',()=>{
  assert.match(directUx,/\.academy-board-object-text\{[^}]*height:auto!important/);
  assert.match(directUx,/\.academy-board-object-text\{[^}]*align-items:flex-start/);
  assert.match(directUx,/\.academy-board-object-text span\{[^}]*pointer-events:auto/);
  assert.doesNotMatch(directUx,/\.academy-board-object-text\.academy-text-heading\{[^}]*min-height:/,'heading must not reserve a fixed multi-line frame height');
  assert.match(directUx,/syncTextFrameHeight/,'frame height must follow rendered text content');
});

test('obsolete direct-edit helper text stays hidden',()=>{
  assert.match(directUx,/\.academy-board-editor-head span\{display:none!important\}/);
  assert.match(editor.editorMarkup(),/Direkt in der Darstellung bearbeiten/,'legacy markup may remain but must not be visible');
});
