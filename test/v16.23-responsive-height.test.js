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

test('V0.16.23 fits the stage to the actual monitor content area without subtracting media and controls again',()=>{
  assert.match(js,/const monitor=vortrag\.querySelector\('\.monitor-card'\)/);
  assert.match(js,/const stage=vortrag\.querySelector\('\.v1623-stage-workspace \.stage'\)/);
  assert.match(js,/const toolbar=monitor\.querySelector\('\.monitor-toolbar'\)/);
  assert.match(js,/const monitorStyle=view\.getComputedStyle\?\.\(monitor\)/);
  assert.match(js,/const monitorWidth=Math\.max\(0,Math\.floor\(monitor\.clientWidth-px\(monitorStyle\?\.paddingLeft\)-px\(monitorStyle\?\.paddingRight\)\)\)/);
  assert.match(js,/const toolbarHeight=toolbar\?\.getBoundingClientRect\(\)\.height\|\|0/);
  assert.match(js,/const toolbarMarginBottom=px\(toolbarStyle\?\.marginBottom\)/);
  assert.match(js,/const monitorHeight=Math\.max\(0,Math\.floor\(monitor\.clientHeight-px\(monitorStyle\?\.paddingTop\)-px\(monitorStyle\?\.paddingBottom\)-toolbarHeight-toolbarMarginBottom\)\)/);
  assert.match(js,/const stageWidth=Math\.min\(monitorWidth,Math\.floor\(monitorHeight\*16\/9\)\)/);
  assert.match(js,/const stageHeight=Math\.floor\(stageWidth\*9\/16\)/);
  assert.match(js,/stage\.style\.setProperty\('width',`\$\{stageWidth\}px`,'important'\)/);
  assert.match(js,/stage\.style\.setProperty\('height',`\$\{stageHeight\}px`,'important'\)/);
  assert.match(js,/stage\.style\.setProperty\('margin','auto','important'\)/);
  assert.doesNotMatch(js,/v1623-media-workspace/);
  assert.doesNotMatch(js,/v1623-stage-controls/);
});
