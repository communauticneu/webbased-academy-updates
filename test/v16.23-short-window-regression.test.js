const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');

test('V0.16.23 keeps the whole Vortrag workspace scrollable when a desktop window is too short',()=>{
  assert.match(js,/vortrag\.style\.setProperty\('overflow-y','auto','important'\)/);
  assert.match(js,/vortrag\.style\.setProperty\('overflow-x','hidden','important'\)/);
  assert.match(js,/vortrag\.style\.setProperty\('min-height','0','important'\)/);
});

test('V0.16.23 removes desktop overflow overrides again in the narrow stacked layout',()=>{
  assert.match(js,/vortrag\.style\.removeProperty\('overflow-y'\)/);
  assert.match(js,/vortrag\.style\.removeProperty\('overflow-x'\)/);
  assert.match(js,/vortrag\.style\.removeProperty\('min-height'\)/);
});
