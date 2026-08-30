const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');

test('selected text remains visible and delete control owns its pointer gesture',()=>{
 assert.match(ux,/academy-board-object-text\.selected/);
 assert.match(ux,/academy-board-object-delete/);
 assert.match(ux,/\[data-direct-delete\]/);
 assert.match(ux,/stopImmediatePropagation\(\)/);
 assert.match(interaction,/event\.target\?\.closest\?\.\('\[data-direct-delete\]'\)/);
});
