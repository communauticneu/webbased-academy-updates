const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');
const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('double click editing is not swallowed by text drag pointer capture',()=>{
  assert.match(interaction,/AcademyPresentationTextDirectUx\?\.isEditingGesture\?\.\(event\)/,
    'stage interaction must let the direct text UX own an editing gesture');
  assert.match(ux,/isEditingGesture/,
    'direct text UX must expose editing gesture detection');
  assert.match(ux,/detail\s*>?=\s*2/,
    'second pointer press of a double click must be recognized as editing intent');
});
