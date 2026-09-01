const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');

const TextSystem=require(path.join(__dirname,'..','src','presentation-text-system.js'));

test('small text uses the same engine behavior as normal with only its own kind size and insertion position',()=>{
 const engine=TextSystem.createEngine();
 const small=engine.addText('small',{content:'Kleiner Text',x:120,y:180});
 assert.equal(small.kind,'small');
 assert.equal(engine.getResolvedStyle(small.id).fontFamily,'Arial');
 assert.equal(engine.getResolvedStyle(small.id).fontSize,25);

 assert.equal(engine.beginEdit(small.id),true);
 assert.equal(engine.updateContent('Bearbeiteter kleiner Text'),true);
 assert.equal(engine.deleteSelected(),false);
 assert.equal(engine.endEdit(),true);

 assert.equal(engine.moveSelected(30,20),true);
 assert.equal(engine.setAlignment('right'),true);
 assert.equal(engine.setCustomColor('#abcdef'),true);
 const edited=engine.getObject(small.id);
 assert.equal(edited.content,'Bearbeiteter kleiner Text');
 assert.equal(edited.x,150);
 assert.equal(edited.y,200);
 assert.equal(edited.align,'right');
 assert.equal(edited.customColor,'#abcdef');

 const duplicate=engine.duplicateSelected();
 assert.equal(duplicate.kind,'small');
 assert.equal(duplicate.content,edited.content);
 assert.equal(duplicate.align,edited.align);
 assert.equal(duplicate.customColor,edited.customColor);
 assert.equal(duplicate.x,edited.x+18);
 assert.equal(duplicate.y,edited.y+18);

 assert.equal(engine.setMedium('board'),true);
 assert.equal(engine.getResolvedStyle(small.id).fontFamily,'DJB Chalk It Up');
 assert.equal(engine.getResolvedStyle(small.id).fontSize,30);
 assert.equal(engine.getResolvedStyle(small.id).color,'#abcdef');
 assert.equal(engine.getObject(small.id).content,'Bearbeiteter kleiner Text');
 assert.equal(engine.getObject(small.id).x,150);
 assert.equal(engine.getObject(small.id).y,200);
});

test('small insertion remains below normal and is not a separate text subsystem',()=>{
 const size={width:934,height:525};
 const normal=TextSystem.getInsertionPosition('normal',size);
 const small=TextSystem.getInsertionPosition('small',size);
 assert.ok(small.x>=normal.x);
 assert.ok(small.y>normal.y);
 assert.deepEqual(TextSystem.TEXT_KINDS,['heading','normal','small']);
});
