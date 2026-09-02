'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const medium=require('../src/presentation-medium-selection.js');

function classes(initial=[]){
  const set=new Set(initial);
  return {
    contains:name=>set.has(name),
    remove:name=>set.delete(name),
    toggle(name,force){const on=force===undefined?!set.has(name):!!force;if(on)set.add(name);else set.delete(name);}
  };
}

function makeEventTarget(){
  const events=[];
  return {events,dispatchEvent(event){events.push(event);return true;}};
}

test('publishMedium emits the same medium change on document and window for all presentation systems',()=>{
  class FakeCustomEvent{constructor(type,options){this.type=type;this.detail=options.detail;}}
  const win=makeEventTarget();
  win.CustomEvent=FakeCustomEvent;
  const doc=makeEventTarget();
  doc.defaultView=win;
  assert.equal(medium.publishMedium(doc,'board'),true);
  assert.equal(doc.events.length,1);
  assert.equal(win.events.length,1);
  assert.equal(doc.events[0].type,'academy-presentation-medium-change');
  assert.equal(win.events[0].type,'academy-presentation-medium-change');
  assert.equal(win.events[0].detail.medium,'board');
});

test('medium selection prepares Tafel, Whiteboard and Pinwall buttons',()=>{
  const buttons=Array.from({length:4},()=>({dataset:{},classList:classes(['active']),hidden:false,textContent:'legacy'}));
  const grid={style:{setProperty(name,value,priority){this[name]=value;this.priority=priority;}}};
  const doc={querySelectorAll(){return buttons;},querySelector(){return grid;}};
  assert.equal(medium.prepareButtons(doc),true);
  assert.deepEqual(buttons.slice(0,3).map(button=>button.dataset.presentationMedium),['chalkboard','whiteboard','pinwall']);
  assert.deepEqual(buttons.slice(0,3).map(button=>button.textContent),['Tafel','Whiteboard','Pinwall']);
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
    getElementById:id=>id==='presentationSurface'?surface:null,
    dispatchEvent(){},
    defaultView:{CustomEvent:class {constructor(type,options){this.type=type;this.detail=options.detail;}},dispatchEvent(){}}
  };
  const stageApi={setAcademyBoardVisible(_doc,visible){if(visible)shown++;}};
  assert.equal(medium.bindPresentationMediumSelection(doc,stageApi),true);
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
