'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/presentation-postit-system.js'),'utf8');
const postit=require('../src/presentation-postit-system.js');

test('selected post-it exposes compact alignment color duplicate and delete controls',()=>{
 assert.match(source,/academy-postit-toolbar/);
 assert.match(source,/data-postit-align="left"/);
 assert.match(source,/data-postit-align="center"/);
 assert.match(source,/data-postit-align="right"/);
 assert.match(source,/data-postit-color=/);
 assert.match(source,/data-postit-action="duplicate"/);
 assert.match(source,/dataset\.postitAction='delete'/);
});

test('selected post-it exposes a resize handle and runtime resize path',()=>{
 assert.match(source,/academy-postit-resize/);
 assert.match(source,/data-postit-resize/);
 assert.match(source,/resizeSelected/);
 assert.match(source,/resizeDrag/);
});

test('post-it controls reuse the approved text-frame visual language',()=>{
 assert.match(source,/academy-postit-toolbar\{[^}]*top:calc\(100% \+ 12px\)/);
 assert.match(source,/border:1px solid rgba\(76,200,255,\.45\)/);
 assert.match(source,/background:rgba\(5,18,27,\.94\)/);
 assert.match(source,/academy-postit-toolbar button\{width:30px;height:28px/);
 assert.match(source,/data-postit-align="left" title="Linksbündig">≡</);
 assert.match(source,/data-postit-align="center" title="Zentriert">≣</);
});

test('delete and resize use matching dark corner buttons while fixed colors remain',()=>{
 assert.match(source,/academy-postit-delete\{position:absolute;right:3px;top:3px;width:22px;height:22px/);
 assert.match(source,/academy-postit-resize\{position:absolute;right:3px;bottom:3px;width:22px;height:22px/);
 assert.match(source,/dataset\.postitResize='true'/);
 assert.match(source,/title='Größe ändern'/);
 assert.match(source,/textContent='↘'/);
});

test('toolbar omits gray without removing its compatibility color value',()=>{
 assert.deepEqual(postit.POSTIT_TOOLBAR_COLORS,['darkYellow','green','beige','red','cyan']);
 assert.equal(postit.POSTIT_PALETTE.lightGray,'#b8b8b2');
});
