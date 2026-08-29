const test=require('node:test');
const assert=require('node:assert/strict');
const editor=require('../src/presentation-object-editor');

test('board editor exposes a PNG-only import input for chalk graphics',()=>{
  const html=editor.editorMarkup();
  assert.match(html,/id="academyBoardGraphicFile"/);
  assert.match(html,/accept="image\/png"/);
});

test('graphic object renders imported transparent PNG data on the board',()=>{
  const html=editor.boardObjectMarkup({id:'g1',type:'graphic',assetUrl:'data:image/png;base64,AAAA',content:'Kopf',frame:{x:10,y:10,width:30,height:30,rotation:0}},'g1');
  assert.match(html,/data:image\/png;base64,AAAA/);
  assert.match(html,/<img/);
});

test('PNG validation accepts PNG files and rejects other image types',()=>{
  assert.equal(editor.isPngFile({type:'image/png',name:'kopf.png'}),true);
  assert.equal(editor.isPngFile({type:'image/jpeg',name:'kopf.jpg'}),false);
  assert.equal(editor.isPngFile({type:'',name:'kopf.PNG'}),true);
});
