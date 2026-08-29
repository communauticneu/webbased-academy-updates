const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('selected text remains visibly selected and delete control is reachable',()=>{
  assert.match(interaction,/data-direct-delete/,'drag handler must explicitly recognize the on-stage delete control');
  assert.match(interaction,/if\s*\(event\.target\?\.closest\?\.\('\[data-direct-delete\]'\)\)\s*return/,
    'delete control must be excluded before drag/pointer capture begins');
  assert.match(ux,/if\s*\(event\.target\?\.closest\?\.\('\[data-direct-delete\]'\)\)\s*(?:return|\{[^}]*stopImmediatePropagation\(\)[^}]*return[^}]*\})/,
    'direct text UX must also exclude delete from object selection/drag handling');
  assert.match(ux,/classList\.toggle\('selected',item===node\)/,
    'clicked text must keep the selected frame until another text is selected');
  assert.match(ux,/academy-board-object-delete/,
    'selected text must expose its delete control on the frame');
});
