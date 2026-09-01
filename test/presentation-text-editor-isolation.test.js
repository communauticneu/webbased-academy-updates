const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const TextSystem=require(path.join(__dirname,'..','src','presentation-text-system.js'));

const free=fs.readFileSync(path.join(__dirname,'..','src','free-presentation.js'),'utf8');
const text=fs.readFileSync(path.join(__dirname,'..','src','presentation-text-system.js'),'utf8');

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

test('scene machinery must not load or preview editor text while text tool is being completed',()=>{
 assert.match(free,/const EDITOR_TEXT_SCENE_SYNC=false;/);
 assert.match(free,/function loadEditorText\(scene\)\{\s*if\(!EDITOR_TEXT_SCENE_SYNC\)return false;/);
 assert.match(free,/function beginSceneTextPreview\(scene\)\{\s*if\(!EDITOR_TEXT_SCENE_SYNC\)return false;/);
});

test('visible text remains clickable and avatar remains pointer-transparent',()=>{
 assert.match(text,/\.academy-text-object\{[^}]*pointer-events:auto/);
 assert.match(text,/\.stage>\.avatar\{[^}]*pointer-events:none/);
});
