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

test('created objects are not repeated as menu rows below the tools',()=>{
  assert.doesNotMatch(editor.editorMarkup(),/academyBoardObjectList/);
  assert.doesNotMatch(editor.editorStyles(),/academy-board-object-row/);
});

test('text variants are visually grouped as a subordinate Textart panel',()=>{
  const html=editor.editorMarkup();
  const css=editor.editorStyles();
  assert.match(html,/academy-text-kind-panel/);
  assert.match(html,/>Textart</);
  assert.match(css,/academy-text-kind-panel/);
  assert.match(css,/academy-text-kind-label/);
});

test('text frames contain the visible text and keep the full frame clickable',()=>{
  const css=editor.editorStyles();
  assert.match(css,/\.academy-board-object-text\{[^}]*align-items:flex-start/);
  assert.match(css,/\.academy-board-object-text\{[^}]*overflow:visible/);
  assert.match(css,/\.academy-board-object-text span\{[^}]*pointer-events:auto/);
  assert.match(css,/academy-text-heading[^}]*min-height/);
});

test('obsolete direct-edit helper text is removed',()=>{
  assert.doesNotMatch(editor.editorMarkup(),/Direkt in der Darstellung bearbeiten/);
});
