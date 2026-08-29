const test=require('node:test');
const assert=require('node:assert/strict');
const editor=require('../src/presentation-object-editor.js');

function node(isText){
  const listeners=[];
  return {
    listeners,
    classList:{contains:name=>isText&&name==='academy-board-object-text'},
    addEventListener:(type)=>listeners.push(type)
  };
}

test('legacy editor pointer binding leaves text objects to direct stage UX only',()=>{
  const text=node(true);
  const other=node(false);
  const layer={querySelectorAll:()=>[text,other]};
  editor.bindPointerEditing({},layer);
  assert.deepEqual(text.listeners,[], 'text must not receive legacy drag or double-click listeners');
  assert.ok(other.listeners.includes('pointerdown'),'non-text objects keep legacy pointer handling');
});
