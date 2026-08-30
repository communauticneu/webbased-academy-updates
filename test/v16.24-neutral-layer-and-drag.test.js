const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');

test('presentation objects use neutral stage layer outside medium surface',()=>{
 assert.match(interaction,/stage=surface\?\.parentElement/);
 assert.match(interaction,/stage\.appendChild\(layer\)/);
});

test('drag uses rendered frame and persists final position',()=>{
 assert.match(interaction,/getBoundingClientRect\(\)/);
 assert.match(interaction,/pendingDrag/);
 assert.match(interaction,/persistFrame\?\.\(doc,drag\.node\.dataset\.objectId,values\)/);
});
