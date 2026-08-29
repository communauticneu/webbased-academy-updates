const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const js=fs.readFileSync(path.join(__dirname,'../src/presentation-stage-v16.17.js'),'utf8');

test('Tafel medium button is explicitly wired to show the empty Academy board immediately',()=>{
  assert.match(js,/data-presentation-medium="chalkboard"/);
  assert.match(js,/function bindPresentationMediumSelection\(doc\)/);
  const fn=js.match(/function bindPresentationMediumSelection\(doc\)[\s\S]*?\n  }/);
  assert.ok(fn,'presentation medium binding missing');
  assert.match(fn[0],/setAcademyBoardVisible\(doc,true\)/);
});

test('production workspace installs presentation medium selection independently from board objects',()=>{
  assert.match(js,/bindPresentationMediumSelection\(doc\)/);
});
