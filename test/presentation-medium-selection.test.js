'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const medium=require('../src/presentation-medium-selection.js');

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
  const buttons=Array.from({length:3},()=>({dataset:{},classList:{remove(){}}}));
  const grid={style:{setProperty(){}}};
  const doc={querySelectorAll(){return buttons;},querySelector(){return grid;}};
  assert.equal(medium.prepareButtons(doc),true);
  assert.deepEqual(buttons.map(button=>button.dataset.presentationMedium),['chalkboard','whiteboard','pinwall']);
  assert.deepEqual(buttons.map(button=>button.textContent),['Tafel','Whiteboard','Pinwall']);
});
