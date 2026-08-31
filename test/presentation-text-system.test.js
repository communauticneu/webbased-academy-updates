const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');

const modulePath=path.join(__dirname,'..','src','presentation-text-system.js');
const TextSystem=require(modulePath);

test('creates exact defaults for heading normal and small',()=>{
 const heading=TextSystem.createTextObject('heading');
 const normal=TextSystem.createTextObject('normal');
 const small=TextSystem.createTextObject('small');
 assert.equal(heading.content,'Neue Überschrift');
 assert.equal(normal.content,'Neuer Text');
 assert.equal(small.content,'Neuer Text');
 assert.equal(heading.kind,'heading');
 assert.equal(normal.kind,'normal');
 assert.equal(small.kind,'small');
 for(const object of [heading,normal,small]){
  assert.equal(object.align,'left');
  assert.equal(object.customColor,null);
  assert.equal(typeof object.x,'number');
  assert.equal(typeof object.y,'number');
  assert.match(object.id,/^academy-text-/);
 }
});

test('uses one exact medium profile mapping for fonts and default colors',()=>{
 assert.deepEqual(TextSystem.MEDIUM_PROFILES.none.fonts,{heading:'Arial',normal:'Arial',small:'Arial'});
 assert.deepEqual(TextSystem.MEDIUM_PROFILES.board.fonts,{heading:'KG Second Chances Sketch',normal:'DJB Chalk It Up',small:'DJB Chalk It Up'});
 assert.equal(TextSystem.MEDIUM_PROFILES.none.defaultColor,'#ffffff');
 assert.equal(TextSystem.MEDIUM_PROFILES.board.defaultColor,'#ffffff');
 assert.equal(TextSystem.MEDIUM_PROFILES.none.weights.heading,700);
 assert.equal(TextSystem.MEDIUM_PROFILES.none.weights.normal,400);
 assert.equal(TextSystem.MEDIUM_PROFILES.board.weights.heading,400);
});

test('resolves medium style without mutating text data',()=>{
 const text=TextSystem.createTextObject('heading',{content:'Titel',x:123,y:77,align:'center'});
 const before=structuredClone(text);
 const none=TextSystem.resolveStyle(text,'none');
 const board=TextSystem.resolveStyle(text,'board');
 assert.deepEqual(text,before);
 assert.equal(none.fontFamily,'Arial');
 assert.equal(none.fontWeight,700);
 assert.equal(board.fontFamily,'KG Second Chances Sketch');
 assert.equal(board.fontWeight,400);
 assert.equal(none.color,'#ffffff');
 assert.equal(board.color,'#ffffff');
});

test('custom color overrides every medium default',()=>{
 const text=TextSystem.createTextObject('normal',{customColor:'#ff9900'});
 assert.equal(TextSystem.resolveStyle(text,'none').color,'#ff9900');
 assert.equal(TextSystem.resolveStyle(text,'board').color,'#ff9900');
});

test('duplicate copies defined properties but gets a new id and offset position',()=>{
 const original=TextSystem.createTextObject('small',{content:'Kopie',x:80,y:120,align:'right',customColor:'#123456'});
 const copy=TextSystem.duplicateTextObject(original);
 assert.notEqual(copy.id,original.id);
 assert.equal(copy.content,original.content);
 assert.equal(copy.kind,original.kind);
 assert.equal(copy.align,original.align);
 assert.equal(copy.customColor,original.customColor);
 assert.equal(copy.x,original.x+18);
 assert.equal(copy.y,original.y+18);
});

test('rejects unsupported text kinds and presentation media',()=>{
 assert.throws(()=>TextSystem.createTextObject('giant'),/Unsupported text kind/);
 const text=TextSystem.createTextObject('normal');
 assert.throws(()=>TextSystem.resolveStyle(text,'whiteboard'),/Unsupported presentation medium/);
});
