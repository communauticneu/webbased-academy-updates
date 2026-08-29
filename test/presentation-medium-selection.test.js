const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const bridge=require('../src/presentation-medium-selection');

test('Tafel medium selection shows the empty Academy board immediately without creating content',()=>{
  let shown=0;
  const button={dataset:{presentationMedium:'chalkboard'},classList:{toggle(){}},addEventListener(type,fn){this.click=fn;}};
  const doc={querySelectorAll:selector=>selector==='[data-presentation-medium]'?[button]:[]};
  const stageApi={setAcademyBoardVisible(_doc,visible){if(visible)shown++;}};
  assert.equal(bridge.bindPresentationMediumSelection(doc,stageApi),true);
  button.click();
  assert.equal(shown,1);
});

test('preload loads medium selection bridge after the stage script',()=>{
  const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');
  assert.match(preload,/presentation-medium-selection\.js/);
});
