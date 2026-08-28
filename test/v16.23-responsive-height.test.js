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

test('V0.16.23 measures actual media, controls, grid gaps and monitor chrome instead of fixed reserve guesses',()=>{
  assert.match(js,/const media=vortrag\.querySelector\('\.v1623-media-workspace'\)/);
  assert.match(js,/const controls=vortrag\.querySelector\('\.v1623-stage-controls'\)/);
  assert.match(js,/const monitor=vortrag\.querySelector\('\.monitor-card'\)/);
  assert.match(js,/const stage=vortrag\.querySelector\('\.v1623-stage-workspace \.stage'\)/);
  assert.match(js,/media\.getBoundingClientRect\(\)\.height/);
  assert.match(js,/controls\.getBoundingClientRect\(\)\.height/);
  assert.match(js,/stage\.getBoundingClientRect\(\)\.top-monitor\.getBoundingClientRect\(\)\.top/);
  assert.match(js,/monitor\.getBoundingClientRect\(\)\.bottom-stage\.getBoundingClientRect\(\)\.bottom/);
  assert.match(js,/getComputedStyle\?\.\(workspace\)/);
  assert.match(js,/getComputedStyle\?\.\(stageWorkspace\)/);
  assert.match(js,/vortrag\.style\.setProperty\('--v1623-stage-max-height',`\$\{stageAvailable\}px`\)/);
});
