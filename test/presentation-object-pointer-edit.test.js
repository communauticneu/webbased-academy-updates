const test=require('node:test');
const assert=require('node:assert/strict');
const editor=require('../src/presentation-object-editor');

test('drag math moves an object in board percentages and clamps it inside the board',()=>{
  const object={id:'x',type:'text',content:'A',frame:{x:10,y:20,width:30,height:15,rotation:0}};
  const moved=editor.moveObject(object,25,-10);
  assert.deepEqual(moved.frame,{x:35,y:10,width:30,height:15,rotation:0});
  const clamped=editor.moveObject(object,100,100);
  assert.equal(clamped.frame.x,70);
  assert.equal(clamped.frame.y,85);
});

test('resize math changes width and height while keeping the object inside the board',()=>{
  const object={id:'x',type:'text',content:'A',frame:{x:60,y:65,width:20,height:20,rotation:0}};
  const resized=editor.resizeObject(object,50,50);
  assert.equal(resized.frame.width,40);
  assert.equal(resized.frame.height,35);
  const minimum=editor.resizeObject(object,-100,-100);
  assert.ok(minimum.frame.width>=4);
  assert.ok(minimum.frame.height>=4);
});

test('selected board object exposes a resize handle for direct manipulation',()=>{
  const html=editor.boardObjectMarkup({id:'x',type:'text',content:'A',frame:{x:10,y:10,width:30,height:10,rotation:0}},'x');
  assert.match(html,/academy-board-resize-handle/);
  assert.match(html,/data-resize-handle/);
});

test('pointer editor styles expose move and resize cursors without changing stage geometry',()=>{
  const css=editor.editorStyles();
  assert.match(css,/cursor:move/);
  assert.match(css,/cursor:nwse-resize/);
  assert.doesNotMatch(css,/\.stage\s*\{/);
});
