const test=require('node:test');
const assert=require('node:assert/strict');
const editor=require('../src/presentation-object-editor');

test('board object markup renders editable text, post-it and chalk marks',()=>{
  const text=editor.boardObjectMarkup({id:'t1',type:'text',content:'Kognitive Kompetenz',frame:{x:12,y:12,width:42,height:14,rotation:0}});
  const postit=editor.boardObjectMarkup({id:'p1',type:'postit',content:'Expressive Kompetenz',frame:{x:20,y:30,width:30,height:14,rotation:-2}});
  const arrow=editor.boardObjectMarkup({id:'a1',type:'arrow',content:'',frame:{x:18,y:48,width:30,height:12,rotation:0}});
  assert.match(text,/Kognitive Kompetenz/); assert.match(text,/academy-board-object-text/);
  assert.match(postit,/Expressive Kompetenz/); assert.match(postit,/academy-board-object-postit/);
  assert.match(arrow,/academy-board-object-arrow/);
});

test('board editor styles make objects selectable and positionable without changing stage geometry',()=>{
  const css=editor.editorStyles();
  assert.match(css,/academy-board-object-layer/);
  assert.match(css,/position:absolute/);
  assert.match(css,/academy-board-object\.selected/);
  assert.doesNotMatch(css,/\.stage\s*\{/);
});

test('object updates preserve normalized position size and content',()=>{
  const object=editor.updateObject({id:'x',type:'text',content:'Alt',frame:{x:10,y:10,width:30,height:10,rotation:0}},{content:'Neu',x:25,y:35,width:50,height:20,rotation:5});
  assert.equal(object.content,'Neu');
  assert.deepEqual(object.frame,{x:25,y:35,width:50,height:20,rotation:5});
});

test('normal board toolbar stays compact and hides precision fields behind details',()=>{
  const html=editor.editorMarkup();
  assert.match(html,/academyBoardObjectToolbar/);
  assert.match(html,/<details[^>]*academy-board-object-precision/);
  assert.match(html,/>Feinjustierung</);
  assert.match(html,/data-prop="x"/);
  assert.match(html,/data-prop="rotation"/);
  assert.doesNotMatch(html,/<div id="academyBoardObjectProperties"[^>]*hidden>/);
});
