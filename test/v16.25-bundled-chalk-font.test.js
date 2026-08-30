const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');
const fonts=fs.readFileSync(path.join(__dirname,'../src/academy-fonts.css'),'utf8');

test('both approved chalk fonts are bundled behind Academy aliases',()=>{
 assert.match(fonts,/font-family:"Academy KG Sketch"/);
 assert.match(fonts,/KGSecondChancesSketch\.ttf/);
 assert.match(fonts,/font-family:"Academy DJB Chalk"/);
 assert.match(fonts,/DJB Chalk It Up\.ttf/);
 assert.ok(fs.existsSync(path.join(__dirname,'../src/assets/fonts/KGSecondChancesSketch.ttf')));
 assert.ok(fs.existsSync(path.join(__dirname,'../src/assets/fonts/DJB Chalk It Up.ttf')));
});

test('font stylesheet loads before presentation scripts',()=>{
 const fi=preload.indexOf("fontStyle.href = 'academy-fonts.css'");
 const si=preload.indexOf("stageScript.src = 'presentation-stage-v16.17.js'");
 assert.ok(fi>=0&&si>fi);
});

test('chalk font activation follows the real visible chalkboard state',()=>{
 assert.match(ux,/const boardActive=.*presentation-chalkboard.*is-visible/s);
 assert.doesNotMatch(ux,/surface\.dataset\.medium===['"]chalkboard['"]/);
 assert.match(ux,/removeProperty\('font-family'\)/);
});
