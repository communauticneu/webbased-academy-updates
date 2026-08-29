const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
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

test('chalk text prioritizes DJB Chalk It Up with safe fallbacks and readable stage size',()=>{
  const css=editor.editorStyles();
  const stage=fs.readFileSync(path.join(__dirname,'../src/presentation-stage-v16.17.css'),'utf8');
  assert.match(css,/DJB Chalk It Up/);
  assert.match(css,/Segoe Print/);
  assert.match(stage,/\.stage \.academy-board-object-text\{[^}]*font-size:clamp\(24px,2\.4vw,54px\)!important/);
});

test('Academy chalkboard uses only the supplied board artwork',()=>{
  const stage=fs.readFileSync(path.join(__dirname,'../src/presentation-stage-v16.17.css'),'utf8');
  const board=stage.match(/\.stage \.presentation-surface\.presentation-chalkboard\{[\s\S]*?\}/)?.[0]||'';
  assert.match(board,/background-image:url\('assets\/academy-tafel-vorlage\.png'\)!important/);
  assert.doesNotMatch(board,/radial-gradient/);
  assert.doesNotMatch(board,/linear-gradient/);
  assert.doesNotMatch(board,/tafel-academy\.jpg/);
});
