const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const TextSystem=require(path.join(__dirname,'..','src','presentation-text-system.js'));

test('text position is normalized to stage size without changing font profile',()=>{
 const ratio=TextSystem.positionToRatio({x:160,y:54},{width:934,height:525});
 const small=TextSystem.positionFromRatio(ratio,{width:358,height:201});
 assert.ok(Math.abs(small.x-61.33)<0.1);
 assert.ok(Math.abs(small.y-20.67)<0.1);
 assert.equal(TextSystem.MEDIUM_PROFILES.none.sizes.heading,42);
 assert.equal(TextSystem.MEDIUM_PROFILES.board.sizes.heading,39);
});

test('normalized position remains inside the stage and does not collapse at the right edge',()=>{
 const ratio=TextSystem.positionToRatio({x:720,y:80},{width:934,height:525});
 const small=TextSystem.positionFromRatio(ratio,{width:358,height:201});
 assert.ok(small.x<300);
 assert.ok(small.x>=0);
});

test('engine can update layout position without changing selection or edit state',()=>{
 const engine=TextSystem.createEngine();
 const object=engine.addText('heading');
 engine.beginEdit(object.id);
 assert.equal(engine.setLayoutPosition(object.id,120,40),true);
 assert.deepEqual(engine.getState(),{selectedId:object.id,editingId:object.id,medium:'none',previewing:false});
 assert.equal(engine.getObject(object.id).x,120);
 assert.equal(engine.getObject(object.id).y,40);
});
