const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');
const fontsCss=fs.readFileSync(path.join(__dirname,'../src/academy-fonts.css'),'utf8');
const fontPath=path.join(__dirname,'../src/assets/fonts/KGSecondChancesSketch.ttf');

test('bundled chalk font is declared in a static renderer stylesheet',()=>{
  assert.match(fontsCss,/@font-face/);
  assert.match(fontsCss,/font-family:\"KG Second Chances Sketch\"/);
  assert.match(fontsCss,/url\(\"\.\/assets\/fonts\/KGSecondChancesSketch\.ttf\"\)/);
});

test('font stylesheet loads before presentation scripts',()=>{
  const fontIndex=preload.indexOf("fontStyle.href = 'academy-fonts.css'");
  const scriptIndex=preload.indexOf("stageScript.src = 'presentation-stage-v16.17.js'");
  assert.ok(fontIndex>=0 && scriptIndex>fontIndex);
});

test('bundled chalk font asset exists in the Creator project',()=>{
  assert.ok(fs.existsSync(fontPath),'KGSecondChancesSketch.ttf must be bundled under src/assets/fonts');
});

test('chalkboard text requests KG Second Chances Sketch',()=>{
  assert.match(ux,/\.presentation-chalkboard \.academy-board-object-text\{[^}]*font-family:\"KG Second Chances Sketch\"!important/);
});
