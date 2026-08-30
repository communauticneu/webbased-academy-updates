const test=require('node:test');
const assert=require('node:assert/strict');
const editor=require('../src/presentation-object-editor');

test('presentation editor exposes Text & Zeichen without graphics or legacy property controls',()=>{
  const html=editor.editorMarkup();
  assert.match(html,/Text &amp; Zeichen|Text & Zeichen/);
  for(const label of ['Text','Post-it','Pfeil','Kreis','Linie']) assert.match(html,new RegExp(label));
  assert.doesNotMatch(html,/data-board-object="graphic"/);
  assert.doesNotMatch(html,/academyBoardObjectProperties/);
  assert.doesNotMatch(html,/Feinjustierung/);
  assert.doesNotMatch(html,/data-prop="content"/);
  assert.doesNotMatch(html,/<strong>Grafiken<\/strong>/);
  assert.match(html,/academyBoardObjectToolbar/);
  assert.match(html,/academyBoardObjectList/);
});

test('graphics are a separate prepared section for placement after presentation medium',()=>{
  const html=editor.graphicsMarkup();
  assert.match(html,/<strong>Grafiken<\/strong>/);
  assert.match(html,/data-graphics-open/);
  assert.doesNotMatch(html,/Text &amp; Zeichen|Text & Zeichen/);
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
