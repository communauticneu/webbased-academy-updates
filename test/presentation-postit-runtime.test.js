'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/presentation-postit-system.js'),'utf8');
const shell=fs.readFileSync(path.join(__dirname,'../src/presentation-content-shell.js'),'utf8');
const postit=require('../src/presentation-postit-system.js');

test('post-it runtime owns one stage layer and photorealistic scalable paper renderer',()=>{
 assert.match(source,/academyPostItLayer/);
 assert.match(source,/academy-postit-paper/);
 assert.match(source,/linear-gradient/);
 assert.match(source,/box-shadow/);
 assert.match(source,/academy-postit-fold/);
});

test('post-it runtime exposes installation and creation without changing text system',()=>{
 assert.match(source,/function install\(/);
 assert.match(source,/function addPostIt\(/);
 assert.match(source,/academy-presentation-medium-change/);
 assert.doesNotMatch(source,/AcademyTextSystem\s*=/);
});

test('creator Post-it button invokes the isolated post-it system',()=>{
 assert.match(shell,/data-content-tool="postit"/);
 assert.match(shell,/AcademyPostItSystem\?\.addPostIt\?\.\(\)/);
});

test('visible post-it supports direct editing and pointer interaction',()=>{
 assert.match(source,/contentEditable/);
 assert.match(source,/dblclick/);
 assert.match(source,/pointerdown/);
 assert.match(source,/pointermove/);
 assert.match(source,/pointerup/);
});

test('rendering preserves the Post-it DOM node so a double-click can finish on the same target',()=>{
 assert.doesNotMatch(source,/academyPostItLayer\.replaceChildren\(\)/);
 assert.match(source,/querySelector\(`\[data-postit-id="\$\{item\.id\}"\]`\)/);
});

test('approved paper is one coherent transparent production frame',()=>{
 const png=fs.readFileSync(path.join(__dirname,'../src/assets/postit-frame-9slice.png'));
 assert.deepEqual(Array.from(png.subarray(1,4)),[80,78,71]);
 assert.ok(png.readUInt32BE(16)>=2000,'frame must retain production resolution');
 assert.equal(png[25],6,'frame must contain a real alpha channel');
 assert.match(source,/academy-postit-nine-tl/);
 assert.match(source,/url\('\.\/assets\/postit-frame-9slice\.png'\)/);
 assert.doesNotMatch(source,/postit-curl-left-4k|postit-curl-right-bottom-4k|postit-edge-right-top-4k/);
});

test('nine independent grid areas keep fixed corners while only centre rows and columns grow',()=>{
 assert.match(source,/grid-template-columns:30px minmax\(0,1fr\) 42px/);
 assert.match(source,/grid-template-rows:28px minmax\(0,1fr\) 30px/);
 for(const area of ['tl','t','tr','l','r','bl','b','br'])assert.match(source,new RegExp('academy-postit-nine-'+area));
 assert.match(source,/frame\.append\(tl,t,tr,l,r,bl,b,br\)/);
 assert.match(source,/paper\.append\(surface,frame,text,fold\)/);
 assert.doesNotMatch(source,/border-image/);
 assert.doesNotMatch(source,/leftCurl|rightEdge|rightCurl/);
});

test('short Post-it strips use one smaller fixed frame while normal Post-its keep the production frame',()=>{
 assert.equal(postit.resolvePostItFrameScale(330,58),0.62);
 assert.equal(postit.resolvePostItFrameScale(330,89),0.62);
 assert.equal(postit.resolvePostItFrameScale(330,90),1);
 assert.equal(postit.resolvePostItFrameScale(330,520),1);
});
