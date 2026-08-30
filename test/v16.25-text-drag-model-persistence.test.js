const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/presentation-object-stage-interaction.js'),'utf8');

test('text pointerdown selects the editor model before drag persistence',()=>{
  const textBranch=source.match(/if\(node\.classList\?\.contains\?\.\('academy-board-object-text'\)\)\{([\s\S]*?)pendingDrag=buildDrag/);
  assert.ok(textBranch,'text drag branch must exist');
  assert.match(textBranch[1],/AcademyPresentationObjectEditor\?\.selectWithoutRender\?\.\(doc,node\.dataset\.objectId,node\)/);
});
