const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const fontPath=path.join(__dirname,'../src/assets/fonts/KGSecondChancesSketch.ttf');

test('chalkboard typography declares a bundled KG Second Chances Sketch font face',()=>{
  assert.match(ux,/@font-face\{font-family:\"KG Second Chances Sketch\"/);
  assert.match(ux,/url\(\"\.\/assets\/fonts\/KGSecondChancesSketch\.ttf\"\)/);
  assert.match(ux,/font-display:swap/);
});

test('bundled chalk font asset exists in the Creator project',()=>{
  assert.ok(fs.existsSync(fontPath),'KGSecondChancesSketch.ttf must be bundled under src/assets/fonts');
});

test('chalkboard text uses the bundled family before fallbacks',()=>{
  assert.match(ux,/\.presentation-chalkboard \.academy-board-object-text\{[^}]*font-family:\"KG Second Chances Sketch\"/);
});
