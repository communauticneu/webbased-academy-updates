const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('avatar stays visible but does not block presentation object editing',()=>{
  assert.match(ux,/\.academy-room-avatar[^'{]*\{[^}]*pointer-events:\s*none/i,
    'academy room avatar must let editor pointer input pass through');
  assert.match(ux,/\.avatar[^'{]*\{[^}]*pointer-events:\s*none/i,
    'legacy avatar must let editor pointer input pass through');
});
