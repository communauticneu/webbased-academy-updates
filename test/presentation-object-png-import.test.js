const test=require('node:test');
const assert=require('node:assert/strict');
const editor=require('../src/presentation-object-editor');

test('text and signs editor no longer exposes the legacy PNG import control',()=>{
  const html=editor.editorMarkup();
  assert.doesNotMatch(html,/id="academyBoardGraphicFile"/);
  assert.doesNotMatch(html,/data-board-object="graphic"/);
  assert.match(html,/Text &amp; Zeichen/);
});

test('graphic object model still renders imported transparent PNG data',()=>{
  const html=editor.boardObjectMarkup({id:'g1',type:'graphic',assetUrl:'data:image/png;base64,AAAA',content:'Kopf',frame:{x:10,y:10,width:30,height:30,rotation:0}},'g1');
  assert.match(html,/data:image\/png;base64,AAAA/);
  assert.match(html,/<img/);
});

test('PNG validation remains available for graphic import handling',()=>{
  assert.equal(editor.isPngFile({type:'image/png',name:'kopf.png'}),true);
  assert.equal(editor.isPngFile({type:'image/jpeg',name:'kopf.jpg'}),false);
  assert.equal(editor.isPngFile({type:'',name:'kopf.PNG'}),true);
});
