const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('outgoing presentation medium gets a temporary exit clone',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/function animatePresentationExit\(scene,doc\)/);
  assert.match(js,/cloneNode\(true\)/);
  assert.match(js,/presentation-exit-clone/);
  assert.match(js,/clone\.dataset\.enter=s\.mediumExit/);
});

test('scene completion animates exit clone before entering next scene',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/animatePresentationExit\(scenes\[sceneIndex\],doc\)/);
  assert.match(js,/setTimeout\(\(\)=>clone\.remove\(\)/);
});

test('exit clone never becomes the editable presentation surface',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/clone\.removeAttribute\('id'\)/);
  assert.match(js,/clone\.setAttribute\('aria-hidden','true'\)/);
});
