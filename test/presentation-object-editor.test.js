const test=require('node:test');
const assert=require('node:assert/strict');
const editor=require('../src/presentation-object-editor');

test('presentation editor exposes the compact Academy tool set',()=>{
  const html=editor.editorMarkup();
  for(const label of ['Text','Post-it','Grafik','Pfeil','Kreis','Linie']) assert.match(html,new RegExp(label));
  assert.doesNotMatch(html,/Kreidetext/);
  assert.match(html,/academyBoardObjectToolbar/);
  assert.match(html,/academyBoardObjectList/);
});

test('text is a neutral reusable presentation object',()=>{
  const object=editor.createObjectDraft('text');
  assert.equal(object.type,'text');
  assert.equal(object.content,'Neuer Text');
  assert.equal(object.enter,'fade');
});

test('editor creates reusable presentation objects without timeline coupling',()=>{
  const object=editor.createObjectDraft('postit');
  assert.equal(object.type,'postit');
  assert.equal(object.content,'Neuer Hinweis');
  assert.equal(object.enter,'unroll');
  assert.equal(object.exit,'wipe');
  assert.ok(!('sceneIndex' in object));
  assert.ok(!('speechText' in object));
});

test('standard chalk marks use draw animation and remain scalable',()=>{
  for(const type of ['arrow','circle','line']){
    const object=editor.createObjectDraft(type);
    assert.equal(object.type,type);
    assert.equal(object.enter,'draw');
    assert.ok(object.width>0);
    assert.ok(object.height>0);
  }
});
