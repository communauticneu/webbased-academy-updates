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

test('presentation medium choices are Tafel, Whiteboard and Pinwall with no legacy fourth medium',()=>{
  const buttons=Array.from({length:4},()=>({dataset:{},classList:classes(['active']),hidden:false,textContent:'legacy'}));
  const grid={style:{setProperty(name,value,priority){this[name]=value;this.priority=priority;}}};
  const doc={
    querySelectorAll:selector=>selector==='.v1623-medium-grid button'?buttons:[],
    querySelector:selector=>selector==='.v1623-medium-grid'?grid:null
  };
  assert.equal(bridge.prepareButtons(doc),true);
  assert.deepEqual(buttons.slice(0,3).map(button=>button.textContent),['Tafel','Whiteboard','Pinwall']);
  assert.deepEqual(buttons.slice(0,3).map(button=>button.dataset.presentationMedium),['chalkboard','whiteboard','pinwall']);
  assert.equal(buttons[3].hidden,true);
  assert.equal(buttons[3].dataset.presentationMedium,undefined);
  assert.equal(buttons.some(button=>button.classList.contains('active')),false);
  assert.equal(grid.style['grid-template-columns'],'repeat(3,minmax(0,1fr))');
  assert.equal(grid.style.priority,'important');
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
