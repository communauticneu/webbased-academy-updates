const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('direct edit preserves object position through editor model',()=>{
 assert.match(ux,/beginDirectTextEdit\?\.\(doc,node\)/);
 assert.match(editor,/function beginDirectTextEdit\(doc,node\)/);
 assert.doesNotMatch(ux,/\[data-list-id\].*click/s);
});

test('text variants remain a subordinate Textart panel',()=>{
 assert.match(ux,/academy-text-kind-menu::before\{content:"Textart"/);
 assert.match(ux,/background:rgba\(76,200,255,.12\)!important/);
 assert.match(ux,/academy-text-kind-menu button\{min-height:29px!important/);
});

test('text frames stay clickable and follow rendered content',()=>{
 assert.match(ux,/\.academy-board-object-text\{pointer-events:auto!important/);
 assert.match(ux,/const syncFrame=node=>/);
 assert.match(ux,/scrollWidth\+20/);
 assert.match(ux,/scrollHeight/);
});
