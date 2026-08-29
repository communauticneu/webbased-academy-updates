const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');
const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');

test('full text frame is the persistent selection and interaction area',()=>{
  assert.match(ux,/closest\?\.\('\.academy-board-object-text\[data-object-id\]'\)/,
    'selection must resolve from anywhere inside the whole text object frame');
  assert.match(ux,/dataset\.activeTextId/,
    'direct text UX must persist the active text id independently of transient DOM selection');
  assert.match(ux,/restoreActiveSelection/,
    'active selection must be restored after editor rerenders');
  assert.match(interaction,/AcademyPresentationTextDirectUx\?\.activate/,
    'drag interaction must use the same single text selection controller');
});
