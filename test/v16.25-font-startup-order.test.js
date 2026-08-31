const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'..','src','preload.js'),'utf8');
test('presentation scripts start only after both bundled chalk fonts are loaded',()=>{
  assert.match(src,/document\.fonts\.load\('24px "Academy KG Sketch"'\)/);
  assert.match(src,/document\.fonts\.load\('24px "Academy DJB Chalk"'\)/);
  assert.match(src,/Promise\.all/);
  assert.match(src,/startPresentationExtensions/);
});
