const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('creating chalk text must not activate the chalkboard by itself',()=>{
  const addBlock=editor.match(/function add\(doc,draft\)\{[\s\S]*?return o;\}/)?.[0]||'';
  assert.doesNotMatch(addBlock,/classList\.add\('presentation-chalkboard','is-visible'\)/,'chalk text creation must not switch the board on');
  assert.doesNotMatch(addBlock,/setAttribute\('aria-hidden','false'\)/,'chalk text creation must not force the board visible');
});
