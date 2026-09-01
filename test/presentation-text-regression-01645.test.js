const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=name=>fs.readFileSync(path.join(__dirname,'..','src',name),'utf8');

test('responsive display must never mutate editor text coordinates',()=>{
 const text=src('presentation-text-system.js');
 assert.equal(text.includes('reprojectPositions'),false);
 assert.equal(text.includes('reconcileSurfaceGeometry'),false);
 assert.equal(text.includes('setObjectPosition'),false);
 assert.ok(text.includes(".academy-text-object{position:absolute;display:inline-flex"));
 assert.ok(text.includes('pointer-events:auto'));
});

test('small-format text projection is read-only and uses actual source object dimensions',()=>{
 const text=src('presentation-text-system.js');
 assert.ok(text.includes('syncMiniaturePreview'));
 assert.ok(text.includes("layer.querySelector(`[data-text-id=\\\"${object.id}\\\"]`)"));
 assert.ok(text.includes('sourceNode.getBoundingClientRect'));
 assert.ok(text.includes('scaledWidth'));
 assert.ok(text.includes('Math.min(target.width-scaledWidth'));
 assert.equal(text.includes('engine.reprojectPositions'),false);
});

test('first 0.16.45 start removes only autosaved faulty test text once',()=>{
 const index=src('index.html');
 assert.ok(index.includes("wac_text_reset_01645"));
 assert.ok(index.includes('scene.textObjects=[]'));
 assert.ok(index.includes("localStorage.setItem('wac_text_reset_01645','1')"));
});
