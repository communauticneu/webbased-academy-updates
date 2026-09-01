'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/presentation-postit-system.js'),'utf8');
const shell=fs.readFileSync(path.join(__dirname,'../src/presentation-content-shell.js'),'utf8');

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
