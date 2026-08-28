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

test('V0.16.23 keeps all seven media actions in one visible row without a horizontal scrollbar',()=>{
  assert.match(js,/\.v1623-media-workspace \.media-grid\{[^}]*grid-template-columns:repeat\(7,minmax\(0,1fr\)\)!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-grid\{[^}]*overflow-x:hidden!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item,\.v1623-media-workspace \.v1623-import-tile\{[^}]*height:86px!important[^}]*min-height:86px!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item \.thumb\{[^}]*height:54px!important/s);
  assert.match(js,/const mediaHeight=Math\.max\(118,mediaContentHeight\)/);
});

test('V0.16.23 gives the media library comfortable tile height on the large 3440x1440 workspace',()=>{
  assert.match(js,/@media \(min-width:1600px\) and \(min-height:1100px\)/);
  assert.match(js,/\.v1623-media-workspace \.media-item,\.v1623-media-workspace \.v1623-import-tile\{[^}]*height:110px!important[^}]*min-height:110px!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item \.thumb\{[^}]*height:72px!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item \.name\{[^}]*font-size:11px!important/s);
});

test('V0.16.23 keeps the compact short-height editor without introducing media clipping',()=>{
  assert.match(js,/@media \(min-width:1251px\) and \(max-height:1050px\)/);
  assert.match(js,/\.v1623-scene-editor\{[^}]*overflow-y:hidden!important[^}]*padding:8px!important/s);
  assert.match(js,/\.v1623-editor-meta\{[^}]*margin-bottom:6px!important/s);
  assert.match(js,/\.v1623-editor-body label\{[^}]*margin:3px 0 2px!important/s);
  assert.match(js,/\.v1623-editor-body input,\.v1623-editor-body select\{[^}]*padding:5px 6px!important/s);
  assert.match(js,/\.v1623-section\{[^}]*margin-top:6px!important[^}]*padding-top:6px!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-head\{[^}]*margin-bottom:5px!important/s);
});
