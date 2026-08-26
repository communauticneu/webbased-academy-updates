const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('stage keeps a snapshot of the last visible presentation medium',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/lastVisibleSnapshot/);
  assert.match(js,/surface\.cloneNode\(true\)/);
});

test('outgoing presentation medium gets a temporary exit clone',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/presentation-exit-clone/);
  assert.match(js,/clone\.removeAttribute\('id'\)/);
  assert.match(js,/clone\.dataset\.enter=clone\.dataset\.exit\|\|'fade'/);
  assert.match(js,/stage\.appendChild\(clone\)/);
  assert.match(js,/clone\.classList\.remove\('is-visible'\)/);
});

test('exit clone is removed after its lightweight CSS transition',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/setTimeout\(\(\)=>clone\.remove\(\),durationMs\+80\)/);
  assert.doesNotMatch(js,/WebGL|requestVideoFrameCallback|canvas\.getContext/i);
});

test('mutation history detects a visible-to-next-scene transition even if final surface is visible',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/attributeOldValue:true/);
  assert.match(js,/oldValue.*is-visible/);
});

test('stage remains in presentation composition while an exit clone is animating',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/stage\.querySelector\('\.presentation-exit-clone'\)/);
  assert.match(js,/stageObserver=new MutationObserver\(\(\)=>\{watchSurface\(\);sync\(\);\}\)/);
});
