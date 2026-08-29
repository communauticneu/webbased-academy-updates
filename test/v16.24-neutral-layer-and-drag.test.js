const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('presentation objects live on a neutral layer outside the medium surface',()=>{
  assert.match(editor,/function ensureLayer\(doc\)[\s\S]*?surface\.parentElement/,'object layer must be attached to the stage container, not inside the medium surface');
  assert.doesNotMatch(editor,/surface\.appendChild\(layer\)/,'object layer must not be hidden with the medium surface');
});

test('dragging updates the existing node without re-rendering it during pointermove',()=>{
  const drag=editor.match(/function bindPointerEditing\(doc,layer\)\{[\s\S]*?\nfunction render/)?.[0]||'';
  assert.match(drag,/node\.style\.left=/,'drag must update the current node position directly');
  assert.match(drag,/node\.style\.top=/,'drag must update the current node position directly');
  assert.doesNotMatch(drag,/const move=[\s\S]*?render\(doc\)/,'pointermove must not replace the dragged DOM node');
});
