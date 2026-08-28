const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');

test('V0.16.23 fits the complete 16:9 composition into the visible monitor slot',()=>{
  assert.match(js,/const mediaHead=media\?\.querySelector\?\.\('\.media-head'\)/);
  assert.match(js,/const mediaGrid=media\?\.querySelector\?\.\('\.media-grid'\)/);
  assert.match(js,/const mediaContentHeight=Math\.ceil\(/);
  assert.match(js,/const mediaHeight=Math\.max\(160,mediaContentHeight\)/);
  assert.match(js,/const stageSlotHeight=Math\.max\(0,Math\.floor\(available-mediaHeight-controlsHeight-workspaceGap-stageGap-monitorChromeHeight\)\)/);
  assert.match(js,/const stageWidth=Math\.min\(monitorWidth,Math\.floor\(stageSlotHeight\*16\/9\)\)/);
  assert.match(js,/const stageHeight=Math\.floor\(stageWidth\*9\/16\)/);
});

test('V0.16.23 reserves the full media content instead of forcing a clipped short-height media row',()=>{
  assert.doesNotMatch(js,/const mediaHeight=view\.innerHeight<=1050\?132/);
  assert.doesNotMatch(js,/\.v1623-media-workspace\{height:132px!important;min-height:132px!important\}/);
  assert.doesNotMatch(js,/\.v1623-media-workspace \.media-item\{min-height:68px!important/);
  assert.doesNotMatch(js,/\.v1623-media-workspace \.media-item \.thumb\{height:38px!important/);
  assert.match(js,/media\?\.style\?\.setProperty\('height',`\$\{mediaHeight\}px`,'important'\)/);
});

test('V0.16.23 keeps the room composition itself unchanged while only scaling the stage box',()=>{
  assert.doesNotMatch(js,/backgroundSize/);
  assert.doesNotMatch(js,/avatar/);
  assert.doesNotMatch(js,/presentationSurface/);
  assert.doesNotMatch(js,/transform.*scale/);
});

test('V0.16.23 remains the final stage-sizing authority after legacy delayed fitters',()=>{
  assert.match(js,/const settle=\(\)=>view\?\.setTimeout\?\.\(sync,120\)/);
  assert.match(js,/view\?\.setTimeout\?\.\(sync,1000\)/);
});
