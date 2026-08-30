const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('chalkboard typography declares a bundled KG Second Chances Sketch font face',()=>{
  assert.match(ux,/@font-face\{font-family:\"KG Second Chances Sketch\"/);
  assert.match(ux,/url\(\"\.\/assets\/fonts\/KGSecondChancesSketch\.ttf\"\)/);
  assert.match(ux,/font-display:swap/);
});

test('chalkboard text uses the bundled family before fallbacks',()=>{
  assert.match(ux,/\.presentation-chalkboard \.academy-board-object-text\{[^}]*font-family:\"KG Second Chances Sketch\"/);
});
