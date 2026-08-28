const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const media=fs.readFileSync(path.join(root,'src','media-library-scene-picker.js'),'utf8');

test('V0.16.23 keeps medium-width media tiles in one scrollable row instead of clipping a second row',()=>{
  assert.match(media,/@media \(min-width:1251px\) and \(max-width:1900px\)/);
  assert.match(media,/grid-template-columns:none!important/);
  assert.match(media,/grid-auto-flow:column!important/);
  assert.match(media,/grid-auto-columns:minmax\(150px,1fr\)!important/);
  assert.match(media,/overflow-x:auto!important/);
  assert.match(media,/overflow-y:hidden!important/);
  assert.match(media,/\.v1623-media-workspace \.dropzone\{display:none!important\}/);
});
