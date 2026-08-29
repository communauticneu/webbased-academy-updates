const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('editor auto-installs in the renderer and has a default create path',()=>{
  assert.match(source,/root&&root\.document/);
  assert.match(source,/api\.install\(root\.document\)/);
  assert.match(source,/function appendDraft\(doc,draft\)/);
});
