const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');
const main=fs.readFileSync(path.join(__dirname,'../src/main.js'),'utf8');
const fonts=fs.readFileSync(path.join(__dirname,'../src/academy-fonts.css'),'utf8');

test('both approved chalk fonts are bundled behind Academy aliases',()=>{
 assert.match(fonts,/font-family:"Academy KG Sketch"/);
 assert.match(fonts,/KGSecondChancesSketch\.ttf/);
 assert.match(fonts,/font-family:"Academy DJB Chalk"/);
 assert.match(fonts,/DJB Chalk It Up\.ttf/);
 assert.ok(fs.existsSync(path.join(__dirname,'../src/assets/fonts/KGSecondChancesSketch.ttf')));
 assert.ok(fs.existsSync(path.join(__dirname,'../src/assets/fonts/DJB Chalk It Up.ttf')));
});

test('presentation extensions start independently from chalk font loading',()=>{
 const dom=preload.indexOf("window.addEventListener('DOMContentLoaded'");
 const start=preload.indexOf('startPresentationExtensions();',dom);
 const load=preload.indexOf('loadAcademyFonts();',dom);
 assert.ok(dom>=0&&start>dom&&load>start);
 const fontBlock=preload.slice(load);
 assert.doesNotMatch(fontBlock,/startPresentationExtensions\(\)/);
 assert.match(preload,/new FontFace\('Academy KG Sketch'/);
 assert.match(preload,/new FontFace\('Academy DJB Chalk'/);
});

test('chalk font activation follows the real visible chalkboard state',()=>{
 assert.match(ux,/const boardActive=.*presentation-chalkboard.*is-visible/s);
 assert.doesNotMatch(ux,/surface\.dataset\.medium===['"]chalkboard['"]/);
 assert.match(ux,/removeProperty\('font-family'\)/);
});

test('desktop runtime diagnostic reports all three chalk text kinds and both Academy aliases',()=>{
 assert.match(main,/read\('heading'\)/);
 assert.match(main,/read\('normal'\)/);
 assert.match(main,/read\('small'\)/);
 assert.match(main,/Academy KG Sketch/);
 assert.match(main,/Academy DJB Chalk/);
 assert.match(main,/ACADEMY FONT RUNTIME/);
});
