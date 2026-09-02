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

test('paper medium owns immersive fibres, lifted corners and contact depth',()=>{
 assert.match(source,/\.academy-postit-paper:has\(\.academy-postit-text\[style\*="font-family: Kalam"\]\)\{/);
 assert.match(source,/postit-paper-photoreal\.png/);
 assert.match(source,/border-image-source:url\('\.\/assets\/postit-paper-photoreal\.png'\)/);
 assert.match(source,/font-family: Kalam.*background:transparent/);
 assert.match(source,/font-family: Kalam.*\.academy-postit-fold\{opacity:0/);
 const material=fs.readFileSync(path.join(__dirname,'../src/assets/postit-paper-photoreal.png'));
 assert.deepEqual(Array.from(material.subarray(1,4)),[80,78,71]);
});

test('photographic paper keeps its corner geometry fixed while only its centre stretches',()=>{
 assert.match(source,/border-image-slice:\d+ \d+ \d+ \d+ fill/);
 assert.match(source,/border-image-width:\d+px \d+px \d+px \d+px/);
 assert.doesNotMatch(source,/postit-paper-photoreal\.png'\);background-position:center;background-size:100% 100%/);
});

test('immersive paper treatment stays off the chalkboard surface',()=>{
 assert.doesNotMatch(source,/font-family: KG Second Chances Sketch.*postit-paper-photoreal/);
});

test('all five visible paper colors reuse the same photographic material',()=>{
 for(const color of ['#c99a00','#4f9b57','#c9b88a','#a83d36','#4f9fb4'])assert.match(source,new RegExp(color.replace('#','\\#')+'.*filter:'));
});
