const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=name=>fs.readFileSync(path.join(__dirname,'..','src',name),'utf8');

test('board miniature is a read-only projection of the existing Academy text engine',()=>{
  const text=src('presentation-text-system.js');
  assert.ok(text.includes("doc.getElementById('boardPreview')"),'miniature must target the existing boardPreview');
  assert.ok(text.includes("academyTextMiniatureLayer"),'miniature must have a dedicated read-only projection layer');
  assert.ok(text.includes('engine.getObjects()'),'miniature must read the existing engine objects');
  assert.ok(text.includes('engine.getResolvedStyle(object.id)'),'miniature must reuse centrally resolved font/color/size');
  assert.ok(text.includes('syncMiniaturePreview'),'main text render must synchronize the miniature');
});

test('miniature must not become a second editable text system',()=>{
  const text=src('presentation-text-system.js');
  assert.ok(text.includes('#academyTextMiniatureLayer{'));
  assert.ok(text.includes('pointer-events:none'));
  assert.equal(text.includes('academy-miniature-delete'),false);
  assert.equal(text.includes('academy-miniature-contenteditable'),false);
});

test('legacy board thumbnail text is only a fallback when no new text objects exist',()=>{
  const text=src('presentation-text-system.js');
  assert.ok(text.includes("preview.classList.toggle('academy-has-text-objects',objects.length>0)"));
  assert.ok(text.includes("#boardPreview.academy-has-text-objects>.chalk-title"));
});
