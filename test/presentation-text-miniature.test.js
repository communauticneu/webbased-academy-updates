const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=name=>fs.readFileSync(path.join(__dirname,'..','src',name),'utf8');

test('small-format projection reads the existing text engine without owning editor behavior',()=>{
  const mini=src('presentation-text-miniature.js');
  assert.ok(mini.includes("doc.getElementById('boardPreview')"));
  assert.ok(mini.includes('AcademyTextSystem'));
  assert.ok(mini.includes('engine.getObjects()'));
  assert.ok(mini.includes('engine.getResolvedStyle(object.id)'));
  assert.ok(mini.includes('pointer-events:none'));
  assert.equal(mini.includes('contentEditable'),false);
  assert.equal(mini.includes('deleteSelected'),false);
  assert.equal(mini.includes('moveSelected'),false);
});

test('main text runtime remains the single owner of fonts and editing',()=>{
  const text=src('presentation-text-system.js');
  const mini=src('presentation-text-miniature.js');
  assert.ok(text.includes('KGSecondChancesSketch.ttf'));
  assert.ok(text.includes('DJB Chalk It Up.ttf'));
  assert.equal(mini.includes('KGSecondChancesSketch.ttf'),false);
  assert.equal(mini.includes('DJB Chalk It Up.ttf'),false);
  assert.equal(mini.includes('@font-face'),false);
});
