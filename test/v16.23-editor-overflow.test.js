const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');

test('V0.16.23 editor controls may shrink inside the fixed editor column without horizontal scrolling',()=>{
  assert.match(js,/\.v1623-medium-grid\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)!important/s);
  assert.match(js,/\.v1623-background-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/s);
  assert.match(js,/\.v1623-medium-grid button,\.v1623-background-grid button\{[^}]*min-width:0!important/s);
  assert.match(js,/\.v1623-scene-editor\{[^}]*overflow-x:hidden!important/s);
});

test('V0.16.23 uses a compact short-height mode so editor and media stay fully visible without vertical scrolling',()=>{
  assert.match(js,/@media \(min-width:1251px\) and \(max-height:1050px\)/);
  assert.match(js,/\.v1623-scene-editor\{[^}]*overflow-y:hidden!important[^}]*padding:8px!important/s);
  assert.match(js,/\.v1623-editor-meta\{[^}]*margin-bottom:6px!important/s);
  assert.match(js,/\.v1623-editor-body label\{[^}]*margin:3px 0 2px!important/s);
  assert.match(js,/\.v1623-editor-body input,\.v1623-editor-body select\{[^}]*padding:5px 6px!important/s);
  assert.match(js,/\.v1623-section\{[^}]*margin-top:6px!important[^}]*padding-top:6px!important/s);
  assert.match(js,/\.v1623-media-workspace\{[^}]*height:132px!important[^}]*min-height:132px!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item\{[^}]*min-height:68px!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item \.thumb\{[^}]*height:38px!important/s);
});
