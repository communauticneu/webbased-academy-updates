const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');
const fontsCss=fs.readFileSync(path.join(__dirname,'../src/academy-fonts.css'),'utf8');
const fontPath=path.join(__dirname,'../src/assets/fonts/KGSecondChancesSketch.ttf');

test('bundled chalk font uses an Academy-only alias to avoid family collisions',()=>{
  assert.match(fontsCss,/@font-face/);
  assert.match(fontsCss,/font-family:"Academy KG Sketch"/);
  assert.match(fontsCss,/url\("\.\/assets\/fonts\/KGSecondChancesSketch\.ttf"\)/);
});

test('font stylesheet loads before presentation scripts',()=>{
  const fontIndex=preload.indexOf("fontStyle.href = 'academy-fonts.css'");
  const scriptIndex=preload.indexOf("stageScript.src = 'presentation-stage-v16.17.js'");
  assert.ok(fontIndex>=0 && scriptIndex>fontIndex);
});

test('bundled chalk font asset exists in the Creator project',()=>{
  assert.ok(fs.existsSync(fontPath),'KGSecondChancesSketch.ttf must be bundled under src/assets/fonts');
});

test('chalk font is applied only while the chalkboard is visibly active',()=>{
  assert.match(ux,/const boardActive=.*presentation-chalkboard.*is-visible/s);
  assert.match(ux,/font-family','"Academy KG Sketch"','important'/);
  assert.match(ux,/removeProperty\('font-family'\)/);
});
