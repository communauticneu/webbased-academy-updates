const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');

test('preload loads the bundled chalk font before direct text UX',()=>{
  const fontIndex=preload.indexOf('kg-second-chances-sketch-font.js');
  const uxIndex=preload.indexOf('presentation-text-direct-ux.js');
  assert.ok(fontIndex>=0,'bundled chalk font loader must be present');
  assert.ok(uxIndex>=0 && fontIndex<uxIndex,'font loader must run before direct text UX');
});

test('bundled font loader contains an embedded WOFF2 face',()=>{
  const fontLoader=fs.readFileSync(path.join(__dirname,'../src/kg-second-chances-sketch-font.js'),'utf8');
  assert.match(fontLoader,/@font-face/);
  assert.match(fontLoader,/font-family:\s*['\"]KG Second Chances Sketch['\"]/);
  assert.match(fontLoader,/data:font\/woff2;base64,/);
});
