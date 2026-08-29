const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('double click editing is not swallowed by text drag pointer capture',()=>{
  assert.match(interaction,/pendingDrag/,
    'text pointerdown must stay pending instead of capturing the pointer immediately');
  assert.match(interaction,/Math\.hypot\(/,
    'text drag must wait for actual pointer movement');
  assert.match(ux,/addEventListener\('dblclick'/,
    'direct text UX must own the native double click');
  assert.match(ux,/contentEditable='true'/,
    'double click must switch the text span into editing mode');
});
