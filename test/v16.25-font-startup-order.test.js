const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'..','src','preload.js'),'utf8');

test('presentation starts independently while both bundled chalk fonts load through FontFace',()=>{
  const dom=src.indexOf("window.addEventListener('DOMContentLoaded'");
  const start=src.indexOf('startPresentationExtensions();',dom);
  const load=src.indexOf('loadAcademyFonts();',dom);
  assert.ok(dom>=0&&start>dom&&load>start);
  assert.match(src,/new FontFace\('Academy KG Sketch'/);
  assert.match(src,/new FontFace\('Academy DJB Chalk'/);
  assert.match(src,/Promise\.all\(\[kgFace\.load\(\),djbFace\.load\(\)\]\)/);
  assert.match(src,/document\.fonts\.add\(kgLoaded\)/);
  assert.match(src,/document\.fonts\.add\(djbLoaded\)/);
});
