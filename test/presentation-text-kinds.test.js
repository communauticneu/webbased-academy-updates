const test=require('node:test');
const assert=require('node:assert/strict');
const editor=require('../src/presentation-object-editor');
const model=require('../src/presentation-object-model');

test('text tool exposes heading normal and small choices',()=>{
  const html=editor.editorMarkup();
  assert.match(html,/data-text-kind="heading"[^>]*>Überschrift</);
  assert.match(html,/data-text-kind="normal"[^>]*>Normal</);
  assert.match(html,/data-text-kind="small"[^>]*>Klein</);
});

test('text kind survives normalization and renders a stable class',()=>{
  for(const kind of ['heading','normal','small']){
    const object=model.normalizePresentationObject({id:'t-'+kind,type:'text',content:'Text',textKind:kind,x:10,y:10,width:30,height:10});
    assert.equal(object.textKind,kind);
    assert.match(editor.boardObjectMarkup(object),new RegExp('academy-text-'+kind));
  }
});

test('unknown text kind falls back to normal',()=>{
  const object=model.normalizePresentationObject({type:'text',content:'Text',textKind:'huge'});
  assert.equal(object.textKind,'normal');
});

test('text variants have distinct creator-defined typography sizes',()=>{
  const css=editor.editorStyles();
  assert.match(css,/academy-text-heading/);
  assert.match(css,/academy-text-normal/);
  assert.match(css,/academy-text-small/);
});
