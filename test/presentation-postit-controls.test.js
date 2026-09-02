'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/presentation-postit-system.js'),'utf8');

test('selected post-it exposes compact alignment color duplicate and delete controls',()=>{
 assert.match(source,/academy-postit-toolbar/);
 assert.match(source,/data-postit-align="left"/);
 assert.match(source,/data-postit-align="center"/);
 assert.match(source,/data-postit-align="right"/);
 assert.match(source,/data-postit-color=/);
 assert.match(source,/data-postit-action="duplicate"/);
 assert.match(source,/data-postit-action="delete"/);
});

test('selected post-it exposes a resize handle and runtime resize path',()=>{
 assert.match(source,/academy-postit-resize/);
 assert.match(source,/data-postit-resize/);
 assert.match(source,/resizeSelected/);
 assert.match(source,/resizeDrag/);
});
