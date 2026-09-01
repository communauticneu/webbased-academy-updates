const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const TextSystem=require(path.join(__dirname,'..','src','presentation-text-system.js'));

const text=fs.readFileSync(path.join(__dirname,'..','src','presentation-text-system.js'),'utf8');
const guard=fs.readFileSync(path.join(__dirname,'..','src','presentation-text-editor-guard.js'),'utf8');
const preload=fs.readFileSync(path.join(__dirname,'..','src','preload.js'),'utf8');

test('text editor starts empty and selection works immediately after creation',()=>{
 const engine=TextSystem.createEngine();
 assert.deepEqual(engine.getObjects(),[]);
 const object=engine.addText('heading');
 assert.equal(engine.getState().selectedId,object.id);
 assert.equal(engine.select(null),true);
 assert.equal(engine.select(object.id),true);
 assert.equal(engine.getState().selectedId,object.id);
 assert.equal(engine.getState().previewing,false);
});

test('scene bridge cannot replace or preview the standalone editor',()=>{
 assert.match(guard,/SCENE_TEXT_SYNC_ENABLED=false/);
 assert.match(guard,/replaceObjects:\(\)=>false/);
 assert.match(guard,/beginPreview:\(\)=>false/);
 assert.match(guard,/endPreview:\(\)=>false/);
 assert.ok(preload.indexOf('presentation-text-editor-guard.js')>preload.indexOf('presentation-text-system.js'));
 assert.ok(preload.indexOf('presentation-content-shell.js')>preload.indexOf('presentation-text-editor-guard.js'));
});

test('visible text remains clickable and avatar remains pointer-transparent',()=>{
 assert.match(text,/\.academy-text-object\{[^}]*pointer-events:auto/);
 assert.match(text,/\.stage>\.avatar\{[^}]*pointer-events:none/);
});
