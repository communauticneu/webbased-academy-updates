const test=require('node:test');
const assert=require('node:assert/strict');
const editor=require('../src/presentation-object-editor');

test('text and post-it keep direct editable content without expanding sidebar',()=>{
  const html=editor.editorMarkup();
  assert.match(html,/academy-board-content-field/);
  assert.match(html,/Direkt auf der Tafel bearbeiten/);
  assert.match(html,/Feinjustierung/);
});

test('post-it styling uses realistic paper treatment rather than a flat rectangle',()=>{
  const css=editor.editorStyles();
  assert.match(css,/academy-board-object-postit/);
  assert.match(css,/linear-gradient/);
  assert.match(css,/box-shadow/);
  assert.match(css,/::before/);
  assert.match(css,/::after/);
});

test('chalk text prioritizes DJB Chalk It Up with safe fallbacks',()=>{
  const css=editor.editorStyles();
  assert.match(css,/DJB Chalk It Up/);
  assert.match(css,/Segoe Print/);
});
