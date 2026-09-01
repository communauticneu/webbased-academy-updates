'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const postit=require('../src/presentation-postit-system.js');

test('post-it engine creates, selects and edits independently from text engine',()=>{
  const engine=postit.createEngine();
  const item=engine.addPostIt();
  assert.equal(engine.getState().selectedId,item.id);
  assert.equal(engine.beginEdit(item.id),true);
  assert.equal(engine.updateContent('Wichtiger Hinweis'),true);
  assert.equal(engine.getObject(item.id).content,'Wichtiger Hinweis');
  assert.equal(engine.endEdit(),true);
});

test('post-it engine moves and resizes but never below strip minimum',()=>{
  const engine=postit.createEngine();
  const item=engine.addPostIt();
  engine.moveSelected(40,25);
  assert.equal(engine.getObject(item.id).x,104);
  assert.equal(engine.getObject(item.id).y,97);
  engine.resizeSelected(120,20);
  assert.equal(engine.getObject(item.id).width,330);
  assert.equal(engine.getObject(item.id).height,58);
  engine.resizeSelected(480,120);
  assert.equal(engine.getObject(item.id).width,480);
  assert.equal(engine.getObject(item.id).height,120);
});

test('duplicate inherits post-it properties and is offset',()=>{
  const engine=postit.createEngine();
  const item=engine.addPostIt({content:'Merken',colorKey:'red',width:440,height:90});
  const copy=engine.duplicateSelected();
  assert.equal(copy.content,'Merken');
  assert.equal(copy.colorKey,'red');
  assert.equal(copy.width,440);
  assert.equal(copy.height,90);
  assert.equal(copy.x,item.x+18);
  assert.equal(copy.y,item.y+18);
});

test('delete is blocked while editing and succeeds afterwards',()=>{
  const engine=postit.createEngine();
  const item=engine.addPostIt();
  engine.beginEdit(item.id);
  assert.equal(engine.deleteSelected(),false);
  engine.endEdit();
  assert.equal(engine.deleteSelected(),true);
  assert.equal(engine.getObject(item.id),null);
});
