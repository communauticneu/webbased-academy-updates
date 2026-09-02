'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const postit=require('../src/presentation-postit-system.js');

test('manual resize becomes the new minimum and auto growth never shrinks it',()=>{
 const engine=postit.createEngine();
 const item=engine.addPostIt();
 assert.equal(engine.resizeSelected(460,96),true);
 let resized=engine.getObject(item.id);
 assert.equal(resized.width,460);
 assert.equal(resized.height,96);
 assert.equal(resized.minWidth,460);
 assert.equal(resized.minHeight,96);
 assert.equal(engine.autoGrowSelected(390,70),false);
 resized=engine.getObject(item.id);
 assert.equal(resized.width,460);
 assert.equal(resized.height,96);
});

test('auto growth expands beyond manual minimum when safe content size requires it',()=>{
 const engine=postit.createEngine();
 const item=engine.addPostIt();
 engine.resizeSelected(400,80);
 assert.equal(engine.autoGrowSelected(520,112),true);
 const grown=engine.getObject(item.id);
 assert.equal(grown.width,520);
 assert.equal(grown.height,112);
 assert.equal(grown.minWidth,400);
 assert.equal(grown.minHeight,80);
});

test('automatic growth stops at the available stage width',()=>{
 const item=postit.createPostIt({x:100,width:330,minWidth:330});
 assert.deepEqual(postit.constrainGrowth(item,1800,120,1200),{width:1100,height:138});
});

test('long uninterrupted text wraps inside the Post-it instead of overflowing',()=>{
 const fs=require('node:fs');
 const path=require('node:path');
 const source=fs.readFileSync(path.join(__dirname,'../src/presentation-postit-system.js'),'utf8');
 assert.match(source,/overflow-wrap:anywhere/);
 assert.match(source,/min-width:0/);
});

test('alignment supports left center and right while rejecting invalid values',()=>{
 const engine=postit.createEngine();
 const item=engine.addPostIt();
 assert.equal(engine.setAlignment('left'),true);
 assert.equal(engine.getObject(item.id).align,'left');
 assert.equal(engine.setAlignment('right'),true);
 assert.equal(engine.getObject(item.id).align,'right');
 assert.equal(engine.setAlignment('diagonal'),false);
 assert.equal(engine.getObject(item.id).align,'right');
});
