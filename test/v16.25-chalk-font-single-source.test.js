const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const fonts=fs.readFileSync(path.join(__dirname,'../src/academy-fonts.css'),'utf8');

test('Tafel heading is KG and Normal plus Klein are DJB Chalk It Up',()=>{
 assert.match(fonts,/Academy KG Sketch[\s\S]*KGSecondChancesSketch\.ttf/);
 assert.match(fonts,/Academy DJB Chalk[\s\S]*DJB Chalk It Up\.ttf/);
 assert.match(ux,/academy-text-heading[\s\S]*Academy KG Sketch/);
 assert.match(ux,/academy-text-normal[\s\S]*Academy DJB Chalk/);
 assert.match(ux,/academy-text-small[\s\S]*Academy DJB Chalk/);
 assert.doesNotMatch(ux,/Segoe Print|Comic Sans MS/);
});
