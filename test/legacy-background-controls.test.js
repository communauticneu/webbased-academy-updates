const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const stage=fs.readFileSync(path.join(__dirname,'../src/presentation-stage-v16.17.js'),'utf8');

test('scene editor no longer renders obsolete background controls',()=>{
  assert.doesNotMatch(stage,/v1623-background-grid/,'obsolete Hintergrund controls must be removed from the scene editor');
  assert.doesNotMatch(stage,/<strong>Hintergrund<\/strong>/,'obsolete Hintergrund section heading must be removed');
});
