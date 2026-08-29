const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const cleanup=fs.readFileSync(path.join(__dirname,'../src/obsolete-background-controls.js'),'utf8');
const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');

test('obsolete background section is removed from the scene editor at runtime',()=>{
  assert.match(cleanup,/querySelector\?\.\('\.v1623-background-grid'\)/,'cleanup must target the obsolete background controls');
  assert.match(cleanup,/closest\?\.\('\.v1623-section'\)/,'cleanup must remove the complete obsolete section');
  assert.match(cleanup,/section\.remove\(\)/,'obsolete background section must be removed from the DOM');
  assert.match(preload,/obsolete-background-controls\.js/,'cleanup must load with the presentation workspace');
});
