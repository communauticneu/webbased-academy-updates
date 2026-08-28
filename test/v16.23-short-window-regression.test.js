const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');

test('V0.16.23 keeps the desktop workspace fixed while the stage shrinks to preserve the media row',()=>{
  assert.doesNotMatch(js,/vortrag\.style\.setProperty\('overflow-y','auto','important'\)/);
  assert.doesNotMatch(js,/vortrag\.style\.setProperty\('overflow-x','hidden','important'\)/);
  assert.match(js,/const mediaVisibilityReserve=view\.innerHeight<1000\?90:0;/);
  assert.match(js,/available-mediaHeight-mediaVisibilityReserve-workspaceGap-controlsHeight-stageGap-monitorTopChrome-monitorBottomChrome/);
  assert.match(js,/const stageWidth=Math\.max\(0,Math\.floor\(stageAvailable\*16\/9\)\)/);
  assert.match(js,/stage\.style\.setProperty\('width',`min\(100%, \$\{stageWidth\}px\)`,'important'\)/);
});

test('V0.16.23 removes desktop stage sizing overrides again in the narrow stacked layout',()=>{
  assert.match(js,/stage\?\.style\?\.removeProperty\?\.\('max-height'\)/);
  assert.match(js,/stage\?\.style\?\.removeProperty\?\.\('width'\)/);
});
