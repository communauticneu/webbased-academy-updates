const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');

test('text dragging derives bounds from rendered pixel frame',()=>{
 assert.match(interaction,/const buildDrag=.*getBoundingClientRect\(\)/s);
 assert.match(interaction,/rect\.width\/layerRect\.width\*100/);
 assert.match(interaction,/rect\.height\/layerRect\.height\*100/);
 assert.match(interaction,/Math\.min\(100-drag\.width/);
 assert.match(interaction,/Math\.min\(100-drag\.height/);
});
