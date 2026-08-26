const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('custom presentation medium uses selected image as the surface only',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.presentation-surface\.presentation-custom \.presentation-board-graphic/);
  assert.match(css,/display:\s*none!important/);
});

test('normal chalkboard still permits text plus selected graphic',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/presentation-board-graphic/);
  assert.match(js,/graphic\.src=s\.mediumUrl/);
});
