const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');

test('V0.16.23 fits the complete 16:9 composition into the visible monitor slot',()=>{
  assert.match(js,/const workspace=vortrag\.querySelector\('\.v1623-production-workspace'\)/);
  assert.match(js,/const media=vortrag\.querySelector\('\.v1623-media-workspace'\)/);
  assert.match(js,/const controls=vortrag\.querySelector\('\.v1623-stage-controls'\)/);
  assert.match(js,/const workspaceStyle=view\.getComputedStyle\?\.\(workspace\)/);
  assert.match(js,/const mediaHeight=media\?\.getBoundingClientRect\(\)\.height\|\|0/);
  assert.match(js,/const controlsHeight=controls\?\.getBoundingClientRect\(\)\.height\|\|0/);
  assert.match(js,/const stageSlotHeight=Math\.max\(0,Math\.floor\(available-mediaHeight-controlsHeight-workspaceGap-stageGap-monitorChromeHeight\)\)/);
  assert.match(js,/const stageWidth=Math\.min\(monitorWidth,Math\.floor\(stageSlotHeight\*16\/9\)\)/);
  assert.match(js,/const stageHeight=Math\.floor\(stageWidth\*9\/16\)/);
  assert.match(js,/stage\.style\.setProperty\('width',`\$\{stageWidth\}px`,'important'\)/);
  assert.match(js,/stage\.style\.setProperty\('height',`\$\{stageHeight\}px`,'important'\)/);
  assert.match(js,/stage\.style\.setProperty\('margin','auto','important'\)/);
});

test('V0.16.23 keeps the room composition itself unchanged while only scaling the stage box',()=>{
  assert.doesNotMatch(js,/backgroundSize/);
  assert.doesNotMatch(js,/avatar/);
  assert.doesNotMatch(js,/presentationSurface/);
  assert.doesNotMatch(js,/transform.*scale/);
});

test('V0.16.23 removes desktop stage sizing overrides again in the narrow stacked layout',()=>{
  assert.match(js,/stage\?\.style\?\.removeProperty\?\.\('height'\)/);
  assert.match(js,/stage\?\.style\?\.removeProperty\?\.\('width'\)/);
  assert.match(js,/stage\?\.style\?\.removeProperty\?\.\('margin'\)/);
});
