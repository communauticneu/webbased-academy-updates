const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const directUx=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('direct text editing delegates to the editor model and never clicks the sidebar row',()=>{
  assert.match(directUx,/beginDirectTextEdit\?\.\(doc,node\)/,'editing must use the existing object instead of reselecting it through the sidebar');
  assert.doesNotMatch(directUx,/\[data-list-id=/,'direct editing must not look up a sidebar row');
  assert.doesNotMatch(directUx,/row\?\.click/,'direct editing must not simulate a sidebar click');
});

test('text object list stays inside the sidebar without a horizontal scrollbar',()=>{
  assert.match(directUx,/\.academy-board-object-list\{[^}]*overflow:hidden!important/);
  assert.match(directUx,/\.academy-board-object-row\{[^}]*min-width:0!important/);
});

test('obsolete direct-edit helper text is hidden',()=>{
  assert.match(directUx,/\.academy-board-editor-head span\{display:none!important\}/);
});
