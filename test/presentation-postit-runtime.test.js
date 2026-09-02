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

test('approved immersive paper uses separate production assets with real transparent curls',()=>{
 const names=['postit-paper-texture-4k.png','postit-curl-left-4k.png','postit-curl-right-bottom-4k.png','postit-edge-right-top-4k.png'];
 for(const name of names){
  const png=fs.readFileSync(path.join(__dirname,'../src/assets',name));
  assert.deepEqual(Array.from(png.subarray(1,4)),[80,78,71]);
  assert.ok(png.readUInt32BE(16)>=1200&&png.readUInt32BE(20)>=1000,name+' must retain production resolution');
 }
 for(const name of names.slice(1)){
  const png=fs.readFileSync(path.join(__dirname,'../src/assets',name));
  assert.equal(png[25],6,name+' must contain an alpha channel');
 }
});

test('approved curls and upper-right edge ignore every Post-it size change',()=>{
 for(const className of ['academy-postit-curl-left','academy-postit-curl-right','academy-postit-edge-right']){
  assert.match(source,new RegExp('\\.'+className+'\\{[^}]*width:\\d+px;height:\\d+px'));
 }
 assert.match(source,/academy-postit-surface\{[^}]*background-image:url\('\.\/assets\/postit-paper-texture-4k\.png'\)/);
 assert.match(source,/paper\.append\(surface,leftCurl,text,rightEdge,rightCurl\)/);
 assert.doesNotMatch(source,/postit-paper-photoreal\.png/);
});
