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
