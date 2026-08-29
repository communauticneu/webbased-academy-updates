const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('selected text is interactable above avatar while editing and delete remains clickable',()=>{
  assert.match(ux,/academy-board-object-text\.selected\{[^}]*z-index:\s*\d+/,
    'selected text needs a temporary editor z-index above overlapping stage content');
  assert.match(ux,/academy-board-object-delete\{[^}]*pointer-events:\s*auto/,
    'delete control must explicitly accept pointer input');
  assert.match(ux,/academy-board-object-delete\{[^}]*z-index:\s*\d+/,
    'delete control must stay above the selected frame');
  assert.match(ux,/event\.target\?\.closest\?\.\('\[data-direct-delete\]'\)/,
    'delete action must be handled directly from its own hit target');
});
