const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'src','responsive-height-v16.23.js'),'utf8');

test('V0.16.23 editor controls may shrink inside the fixed editor column without horizontal scrolling',()=>{
  assert.match(js,/\.v1623-medium-grid\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)!important/s);
  assert.match(js,/\.v1623-background-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/s);
  assert.match(js,/\.v1623-medium-grid button,\.v1623-background-grid button\{[^}]*min-width:0!important/s);
  assert.match(js,/\.v1623-scene-editor\{[^}]*overflow-x:hidden!important/s);
});
