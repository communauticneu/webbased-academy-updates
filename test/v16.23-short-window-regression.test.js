const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');

test('V0.16.23 fits the complete 16:9 composition into the visible monitor slot',()=>{
  assert.match(js,/const mediaHeight=Math\.max\(160,media\?\.scrollHeight\|\|0,media\?\.getBoundingClientRect\(\)\.height\|\|0\)/);
  assert.match(js,/const stageSlotHeight=Math\.max\(0,Math\.floor\(available-mediaHeight-controlsHeight-workspaceGap-stageGap-monitorChromeHeight\)\)/);
  assert.match(js,/const stageWidth=Math\.min\(monitorWidth,Math\.floor\(stageSlotHeight\*16\/9\)\)/);
  assert.match(js,/const stageHeight=Math\.floor\(stageWidth\*9\/16\)/);
});

test('V0.16.23 shrink-wraps the outer grid around stage and controls so media is not pushed below the window',()=>{
  assert.match(js,/const monitorHeight=monitorChromeHeight\+stageHeight/);
  assert.match(js,/const stageRowHeight=monitorHeight\+stageGap\+controlsHeight/);
  assert.match(js,/workspace\.style\.setProperty\('grid-template-rows',`\$\{stageRowHeight\}px \$\{mediaHeight\}px`,'important'\)/);
  assert.match(js,/stageWorkspace\.style\.setProperty\('grid-template-rows',`\$\{monitorHeight\}px \$\{controlsHeight\}px`,'important'\)/);
  assert.match(js,/monitor\.style\.setProperty\('height',`\$\{monitorHeight\}px`,'important'\)/);
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
