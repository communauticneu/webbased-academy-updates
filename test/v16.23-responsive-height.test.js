const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');
const preload=fs.readFileSync(path.join(root,'src','preload.js'),'utf8');

test('V0.16.23 measures the real remaining viewport height and updates it on resize',()=>{
  assert.match(js,/function syncProductionWorkspaceHeightV1623\(doc\)/);
  assert.match(js,/getBoundingClientRect\(\)\.top/);
  assert.match(js,/innerHeight/);
  assert.match(js,/style\.setProperty\('height',`\$\{available\}px`,'important'\)/);
  assert.match(js,/addEventListener\?\.\('resize',sync\)/);
  assert.match(preload,/responsive-height-v16\.23\.js/);
});

test('V0.16.23 loads responsive sizing only after the production workspace script finished',()=>{
  assert.match(preload,/stageScript\.onload\s*=\s*\(\)\s*=>\s*\{/);
  assert.match(preload,/stageScript\.onload[\s\S]*?responsiveHeightScript\.src\s*=\s*'responsive-height-v16\.23\.js'/);
  assert.match(preload,/stageScript\.onload[\s\S]*?document\.documentElement\.appendChild\(responsiveHeightScript\)/);
});

test('V0.16.23 reserves the visible Creator UI before fitting the complete 16:9 stage',()=>{
  assert.match(js,/const workspace=vortrag\.querySelector\('\.v1623-production-workspace'\)/);
  assert.match(js,/const monitor=vortrag\.querySelector\('\.monitor-card'\)/);
  assert.match(js,/const stage=vortrag\.querySelector\('\.v1623-stage-workspace \.stage'\)/);
  assert.match(js,/const media=vortrag\.querySelector\('\.v1623-media-workspace'\)/);
  assert.match(js,/const controls=vortrag\.querySelector\('\.v1623-stage-controls'\)/);
  assert.match(js,/const mediaHeight=media\?\.getBoundingClientRect\(\)\.height\|\|0/);
  assert.match(js,/const controlsHeight=controls\?\.getBoundingClientRect\(\)\.height\|\|0/);
  assert.match(js,/const stageSlotHeight=Math\.max\(0,Math\.floor\(available-mediaHeight-controlsHeight-workspaceGap-stageGap-monitorChromeHeight\)\)/);
  assert.match(js,/const stageWidth=Math\.min\(monitorWidth,Math\.floor\(stageSlotHeight\*16\/9\)\)/);
  assert.match(js,/const stageHeight=Math\.floor\(stageWidth\*9\/16\)/);
  assert.match(js,/stage\.style\.setProperty\('width',`\$\{stageWidth\}px`,'important'\)/);
  assert.match(js,/stage\.style\.setProperty\('height',`\$\{stageHeight\}px`,'important'\)/);
  assert.match(js,/stage\.style\.setProperty\('margin','auto','important'\)/);
});
