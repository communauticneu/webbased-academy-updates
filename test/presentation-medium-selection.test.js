const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const bridge=require('../src/presentation-medium-selection');

function classes(initial=[]){
  const set=new Set(initial);
  return {
    contains:name=>set.has(name),
    remove:name=>set.delete(name),
    toggle(name,force){const on=force===undefined?!set.has(name):!!force;if(on)set.add(name);else set.delete(name);}
  };
}

test('presentation medium buttons start neutral and Tafel becomes active only after click',()=>{
  const button={dataset:{},classList:classes(['active']),addEventListener(type,fn){this.click=fn;}};
  const doc={querySelectorAll:selector=>selector==='.v1623-medium-grid button'?[button]:selector==='[data-presentation-medium]'?[button]:[]};
  assert.equal(bridge.prepareButtons(doc),true);
  assert.equal(button.classList.contains('active'),false);
});

test('Tafel medium selection shows an empty Academy board immediately without dummy legacy content',()=>{
  let shown=0;
  const text={textContent:'WISSEN VERSTEHEN.'};
  const graphic={hidden:false,removeAttribute(){this.src='';},src:'legacy.png'};
  const surface={querySelector:selector=>selector==='.presentation-board-text'?text:selector==='.presentation-board-graphic'?graphic:null};
  const button={dataset:{presentationMedium:'chalkboard'},classList:classes(),addEventListener(type,fn){this.click=fn;}};
  const doc={
    querySelectorAll:selector=>selector==='[data-presentation-medium]'?[button]:[],
    getElementById:id=>id==='presentationSurface'?surface:null
  };
  const stageApi={setAcademyBoardVisible(_doc,visible){if(visible)shown++;}};
  assert.equal(bridge.bindPresentationMediumSelection(doc,stageApi),true);
  button.click();
  assert.equal(shown,1);
  assert.equal(button.classList.contains('active'),true);
  assert.equal(text.textContent,'');
  assert.equal(graphic.hidden,true);
});

test('preload loads medium selection bridge after the stage script',()=>{
  const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');
  assert.match(preload,/presentation-medium-selection\.js/);
});
