'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');

const postit=require('../src/presentation-postit-system.js');
const fs=require('node:fs');
const path=require('node:path');

test('new post-it is a dark-yellow one-line strip with centered default text',()=>{
  const item=postit.createPostIt();
  assert.equal(item.content,'Neues Post it');
  assert.equal(item.colorKey,'darkYellow');
  assert.equal(item.align,'center');
  assert.equal(item.width,330);
  assert.equal(item.height,58);
  assert.equal(item.minWidth,330);
  assert.equal(item.minHeight,58);
});

test('post-it colors are owned by one central palette',()=>{
  assert.equal(postit.POSTIT_PALETTE.darkYellow,'#c99a00');
  assert.ok(Object.isFrozen(postit.POSTIT_PALETTE));
});

test('board post-it typography reuses the board heading profile exactly',()=>{
  const style=postit.resolvePostItStyle(postit.createPostIt(),'board');
  assert.equal(style.fontFamily,'KG Second Chances Sketch');
  assert.equal(style.fontSize,39);
  assert.equal(style.fontWeight,400);
  assert.equal(style.textColor,'#ffffff');
});

test('post-it medium styling is separate from the post-it object',()=>{
  const item=postit.createPostIt();
  const before={...item};
  const none=postit.resolvePostItStyle(item,'none');
  const board=postit.resolvePostItStyle(item,'board');
  assert.deepEqual(item,before);
  assert.notEqual(none.fontFamily,board.fontFamily);
  assert.equal(item.colorKey,'darkYellow');
});

test('post-it without a medium uses Kalam Bold with natural capitalization',()=>{
  const item=postit.createPostIt({content:'Neues Post it'});
  const style=postit.resolvePostItStyle(item,'none');
  assert.equal(style.fontFamily,'Kalam');
  assert.equal(style.fontWeight,700);
  assert.equal(item.content,'Neues Post it');
});

test('the bundled Kalam Bold file is registered for rendering',()=>{
  const fontPath=path.join(__dirname,'../src/assets/fonts/Kalam-Bold.ttf');
  const shell=fs.readFileSync(path.join(__dirname,'../src/index.html'),'utf8');
  assert.equal(fs.existsSync(fontPath),true);
  assert.match(shell,/font-family:'Kalam';src:url\('\.\/assets\/fonts\/Kalam-Bold\.ttf'\)/);
});
