const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');

test('text dragging derives bounds from rendered pixel frame instead of parsing px as percent',()=>{
  assert.match(source,/node\.getBoundingClientRect\(\)/);
  assert.match(source,/widthPct\s*=\s*rect\.width\/layerRect\.width\*100/);
  assert.match(source,/heightPct\s*=\s*rect\.height\/layerRect\.height\*100/);
  assert.doesNotMatch(source,/width:parseFloat\(node\.style\.width\)\|\|20/);
  assert.doesNotMatch(source,/height:parseFloat\(node\.style\.height\)\|\|10/);
});
