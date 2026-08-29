const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('direct text decoration does not remove and recreate its delete button on every observed mutation',()=>{
  assert.doesNotMatch(ux,/querySelectorAll\?\.\('\.academy-board-object-delete'\)[\s\S]*?button=>button\.remove\(\)/,
    'observer callback must not remove all delete buttons because that retriggers itself forever');
  assert.match(ux,/querySelector\?\.\('\.academy-board-object-delete'\)/,
    'decoration should reuse an existing delete control when possible');
});
