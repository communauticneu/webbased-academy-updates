const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const interaction=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');
const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');

test('presentation objects are moved to a neutral stage layer outside the medium surface',()=>{
  assert.match(interaction,/const stage=surface\?\.parentElement/,'neutral object layer must use the stage container');
  assert.match(interaction,/stage\.appendChild\(layer\)/,'object layer must be moved outside the medium surface');
  assert.match(preload,/presentation-object-stage-interaction\.js/,'neutral layer interaction must load after the editor');
});

test('dragging updates the existing node without re-rendering it during pointermove',()=>{
  assert.match(interaction,/drag\.node\.style\.left=/,'drag must update the current node position directly');
  assert.match(interaction,/drag\.node\.style\.top=/,'drag must update the current node position directly');
  assert.doesNotMatch(interaction,/pointermove[\s\S]*?render\(doc\)/,'pointermove must not replace the dragged DOM node');
});
