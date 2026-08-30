const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const fontPath=path.join(__dirname,'../src/assets/fonts/KGSecondChancesSketch.ttf');

test('chalkboard typography resolves the bundled KG Second Chances Sketch font from document base URI',()=>{
  assert.match(ux,/@font-face\{font-family:\"KG Second Chances Sketch\"/);
  assert.match(ux,/new URL\('assets\/fonts\/KGSecondChancesSketch\.ttf',doc\.baseURI\)\.href/);
  assert.match(ux,/src:url\(\"\$\{fontUrl\}\"\) format\(\"truetype\"\)/);
  assert.match(ux,/font-display:block/);
  assert.match(ux,/doc\.fonts\?\.load/);
});

test('bundled chalk font asset exists in the Creator project',()=>{
  assert.ok(fs.existsSync(fontPath),'KGSecondChancesSketch.ttf must be bundled under src/assets/fonts');
});

test('chalkboard text uses the bundled family without silently falling back',()=>{
  assert.match(ux,/\.presentation-chalkboard \.academy-board-object-text\{[^}]*font-family:\"KG Second Chances Sketch\"!important/);
});
