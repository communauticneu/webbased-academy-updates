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
 assert.ok(text.includes('.academy-text-object{position:absolute;display:inline-flex'));
 assert.ok(text.includes('pointer-events:auto'));
});

test('small-format renderer is a read-only projection of the existing editor',()=>{
 const mini=src('presentation-text-miniature.js');
 assert.ok(mini.includes('AcademyTextSystem'));
 assert.ok(mini.includes('getEngine'));
 assert.ok(mini.includes("getElementById('academyTextObjectLayer')"));
 assert.ok(mini.includes('sourceNode.getBoundingClientRect'));
 assert.ok(mini.includes('scaledWidth'));
 assert.ok(mini.includes('Math.min(target.width-scaledWidth'));
 for(const forbidden of ['moveSelected(','setObjectPosition(','reprojectPositions(','replaceObjects(','addText(','beginEdit(','MutationObserver','FontFace'])assert.equal(mini.includes(forbidden),false,forbidden);
});

test('first 0.16.45 start removes only autosaved faulty text once',()=>{
 const index=src('index.html');
 assert.ok(index.includes("wac_text_reset_01645"));
 assert.ok(index.includes('scene.textObjects=[]'));
 assert.ok(index.includes("localStorage.setItem('wac_text_reset_01645','1')"));
});
