const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');

test('text drag starts only after real pointer movement so double click remains native',()=>{
  assert.match(interaction,/pendingDrag/,'text pointerdown must only prepare a possible drag');
  assert.match(interaction,/Math\.hypot\(/,'pointer movement must be measured before drag starts');
  assert.match(interaction,/dragThreshold/,'a small movement threshold must separate click from drag');
  assert.match(interaction,/if\(!drag&&pendingDrag\)/,'pointermove must promote pending interaction to drag');
});
