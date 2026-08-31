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

test('engine adds selects and edits one text object without changing its identity',()=>{
 const engine=TextSystem.createEngine();
 const text=engine.addText('normal');
 assert.equal(engine.getState().selectedId,text.id);
 assert.equal(engine.beginEdit(text.id),true);
 assert.equal(engine.getState().editingId,text.id);
 assert.equal(engine.updateContent('Geänderter Text'),true);
 assert.equal(engine.getObject(text.id).content,'Geänderter Text');
 assert.equal(engine.getObject(text.id).id,text.id);
 assert.equal(engine.endEdit(),true);
 assert.equal(engine.getState().editingId,null);
});

test('delete removes selected object only outside active text editing',()=>{
 const engine=TextSystem.createEngine();
 const text=engine.addText('heading');
 engine.beginEdit(text.id);
 assert.equal(engine.deleteSelected(),false);
 assert.equal(engine.getObjects().length,1);
 engine.endEdit();
 assert.equal(engine.deleteSelected(),true);
 assert.equal(engine.getObjects().length,0);
 assert.equal(engine.getState().selectedId,null);
});

test('moving selected text changes only position and clamps to non-negative coordinates',()=>{
 const engine=TextSystem.createEngine();
 const text=engine.addText('small',{content:'Position',x:40,y:50});
 const before={...engine.getObject(text.id)};
 assert.equal(engine.moveSelected(-100,35),true);
 const moved=engine.getObject(text.id);
 assert.equal(moved.x,0);
 assert.equal(moved.y,85);
 assert.equal(moved.content,before.content);
 assert.equal(moved.kind,before.kind);
 assert.equal(moved.align,before.align);
 assert.equal(moved.customColor,before.customColor);
});

test('alignment color and duplication are applied through the selected object',()=>{
 const engine=TextSystem.createEngine();
 const original=engine.addText('normal',{content:'Werkzeug',x:20,y:30});
 assert.equal(engine.setAlignment('center'),true);
 assert.equal(engine.setCustomColor('#00aaff'),true);
 const copy=engine.duplicateSelected();
 assert.equal(engine.getObject(original.id).align,'center');
 assert.equal(engine.getObject(original.id).customColor,'#00aaff');
 assert.equal(copy.content,'Werkzeug');
 assert.equal(copy.kind,'normal');
 assert.equal(copy.align,'center');
 assert.equal(copy.customColor,'#00aaff');
 assert.equal(copy.x,38);
 assert.equal(copy.y,48);
 assert.equal(engine.getState().selectedId,copy.id);
});

test('medium switch preserves every text property and changes resolved style only',()=>{
 const engine=TextSystem.createEngine();
 const text=engine.addText('heading',{content:'Medium',x:111,y:222,align:'right'});
 const before={...engine.getObject(text.id)};
 assert.equal(engine.setMedium('board'),true);
 assert.deepEqual(engine.getObject(text.id),before);
 assert.equal(engine.getState().medium,'board');
 assert.equal(engine.getResolvedStyle(text.id).fontFamily,'KG Second Chances Sketch');
 assert.equal(engine.setMedium('none'),true);
 assert.deepEqual(engine.getObject(text.id),before);
 assert.equal(engine.getResolvedStyle(text.id).fontFamily,'Arial');
});

test('selection editing and movement never change the resolved font',()=>{
 const engine=TextSystem.createEngine();
 const text=engine.addText('normal',{x:60,y:70});
 engine.setMedium('board');
 const expected=engine.getResolvedStyle(text.id).fontFamily;
 assert.equal(expected,'DJB Chalk It Up');
 engine.select(text.id);
 assert.equal(engine.getResolvedStyle(text.id).fontFamily,expected);
 engine.beginEdit(text.id);
 assert.equal(engine.getResolvedStyle(text.id).fontFamily,expected);
 engine.endEdit();
 engine.moveSelected(25,30);
 assert.equal(engine.getResolvedStyle(text.id).fontFamily,expected);
 assert.equal(engine.getObject(text.id).x,85);
 assert.equal(engine.getObject(text.id).y,100);
});

test('custom color and position survive both medium directions',()=>{
 const engine=TextSystem.createEngine();
 const text=engine.addText('small',{x:91,y:143,customColor:'#18c37e'});
 const expected={...engine.getObject(text.id)};
 engine.setMedium('board');
 assert.deepEqual(engine.getObject(text.id),expected);
 assert.equal(engine.getResolvedStyle(text.id).color,'#18c37e');
 engine.setMedium('none');
 assert.deepEqual(engine.getObject(text.id),expected);
 assert.equal(engine.getResolvedStyle(text.id).color,'#18c37e');
});
