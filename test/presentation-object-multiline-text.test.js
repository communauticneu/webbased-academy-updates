const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const textarea=fs.readFileSync(path.join(__dirname,'../src/presentation-textarea-v16.24.js'),'utf8');
const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');

test('chalk text properties upgrade to a compact two-line textarea',()=>{
  assert.match(textarea,/createElement\('textarea'\)/,'chalk text content must upgrade to a textarea');
  assert.match(textarea,/setAttribute\('rows','2'\)/,'chalk text textarea must stay compact at two rows');
  assert.match(textarea,/input\.value=textarea\.value/,'multiline edits must keep the existing content binding');
  assert.match(preload,/presentation-textarea-v16\.24\.js/,'multiline upgrade must load after the board editor');
});
