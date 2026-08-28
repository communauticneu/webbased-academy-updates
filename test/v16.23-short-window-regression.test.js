const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');

test('V0.16.23 sizes the desktop stage from the actual monitor content area without subtracting media twice',()=>{
  assert.doesNotMatch(js,/vortrag\.style\.setProperty\('overflow-y','auto','important'\)/);
  assert.doesNotMatch(js,/const mediaVisibilityReserve=/);
  assert.match(js,/const toolbar=monitor\.querySelector\('\.monitor-toolbar'\)/);
  assert.match(js,/const monitorStyle=view\.getComputedStyle\?\.\(monitor\)/);
  assert.match(js,/const monitorWidth=Math\.max\(0,Math\.floor\(monitor\.clientWidth-px\(monitorStyle\?\.paddingLeft\)-px\(monitorStyle\?\.paddingRight\)\)\)/);
  assert.match(js,/const toolbarHeight=toolbar\?\.getBoundingClientRect\(\)\.height\|\|0/);
  assert.match(js,/const toolbarMarginBottom=px\(toolbarStyle\?\.marginBottom\)/);
  assert.match(js,/const monitorHeight=Math\.max\(0,Math\.floor\(monitor\.clientHeight-px\(monitorStyle\?\.paddingTop\)-px\(monitorStyle\?\.paddingBottom\)-toolbarHeight-toolbarMarginBottom\)\)/);
  assert.match(js,/const stageWidth=Math\.min\(monitorWidth,Math\.floor\(monitorHeight\*16\/9\)\)/);
  assert.match(js,/stage\.style\.setProperty\('width',`\$\{stageWidth\}px`,'important'\)/);
  assert.match(js,/stage\.style\.setProperty\('height',`\$\{stageHeight\}px`,'important'\)/);
  assert.match(js,/stage\.style\.setProperty\('margin','auto','important'\)/);
});

test('V0.16.23 removes desktop stage sizing overrides again in the narrow stacked layout',()=>{
  assert.match(js,/stage\?\.style\?\.removeProperty\?\.\('height'\)/);
  assert.match(js,/stage\?\.style\?\.removeProperty\?\.\('width'\)/);
  assert.match(js,/stage\?\.style\?\.removeProperty\?\.\('margin'\)/);
});
