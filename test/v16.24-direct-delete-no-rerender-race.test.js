const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('direct delete survives pointerdown and deletes selected object directly',()=>{
  assert.match(ux,/if\(event\.target\?\.closest\?\.\('\[data-direct-delete\]'\)\)\{[^}]*stopImmediatePropagation\(\)[^}]*return/,
    'delete pointerdown must be stopped before legacy object drag can rerender the node');
  assert.match(ux,/AcademyPresentationObjectEditor\?\.selectWithoutRender\?\.\(doc,id,node\)/,
    'delete must select the exact object without rerendering first');
  assert.match(ux,/AcademyPresentationObjectEditor\?\.deleteSelected\?\.\(doc\)/,
    'delete must call the editor delete operation directly');
});
