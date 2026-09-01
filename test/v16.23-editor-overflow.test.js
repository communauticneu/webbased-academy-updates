const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');
const preload=fs.readFileSync(path.join(root,'src','preload.js'),'utf8');

test('V0.16.23 editor controls may shrink inside the fixed editor column without horizontal scrolling',()=>{
  assert.match(js,/\.v1623-medium-grid\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)!important/s);
  assert.match(js,/\.v1623-background-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/s);
  assert.match(js,/\.v1623-medium-grid button,\.v1623-background-grid button\{[^}]*min-width:0!important/s);
  assert.match(js,/\.v1623-scene-editor\{[^}]*overflow-x:hidden!important/s);
});

test('V0.16.23 uses dark Creator styling for presentation and background tabs instead of native white buttons',()=>{
  assert.match(js,/\.v1623-medium-grid button,\.v1623-background-grid button\{[^}]*background:#0b1b27!important[^}]*color:#dceaf1!important[^}]*border:1px solid #294b5f!important/s);
  assert.match(js,/\.v1623-medium-grid button\.active,\.v1623-background-grid button\.active\{[^}]*background:#123148!important[^}]*border-color:#4cc8ff!important/s);
});

test('V0.16.23 removes decorative glyph spans from the right editor tabs',()=>{
  assert.match(js,/querySelectorAll\('\.v1623-medium-grid button span, \.v1623-background-grid button span'\)/);
  assert.match(js,/forEach\?\.\(node=>node\.remove\(\)\)/);
});

test('V0.16.23 loads media library styling before responsive sizing so final large-workspace tile sizes win deterministically',()=>{
  assert.match(preload,/appendScript\('presentation-stage-v16\.17\.js',\(\)=>\{[\s\S]*?appendScript\('media-library-scene-picker\.js',\(\)=>appendScript\('responsive-height-v16\.23\.js'\)\)/);
});

test('V0.16.23 keeps all seven media actions in one visible row without a horizontal scrollbar',()=>{
  assert.match(js,/\.v1623-media-workspace \.media-grid\{[^}]*grid-template-columns:repeat\(7,minmax\(0,1fr\)\)!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-grid\{[^}]*overflow-x:hidden!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item,\.v1623-media-workspace \.v1623-import-tile\{[^}]*height:86px!important[^}]*min-height:86px!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item \.thumb\{[^}]*height:54px!important/s);
  assert.match(js,/const mediaHeight=Math\.max\(118,mediaContentHeight\)/);
});

test('V0.16.23 keeps large-workspace media tiles at a fixed proportional width instead of stretching across the row',()=>{
  assert.match(js,/@media \(min-width:1600px\) and \(min-height:1100px\)/);
  assert.match(js,/\.v1623-media-workspace \.media-grid\{[^}]*grid-template-columns:repeat\(7,220px\)!important[^}]*justify-content:start!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item,\.v1623-media-workspace \.v1623-import-tile\{[^}]*height:150px!important[^}]*min-height:150px!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item \.thumb\{[^}]*height:108px!important/s);
  assert.match(js,/\.v1623-media-workspace \.media-item \.name\{[^}]*font-size:12px!important/s);
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
