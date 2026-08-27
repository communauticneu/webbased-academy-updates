const test=require('node:test');
const assert=require('node:assert/strict');

const fresh=()=>{
  delete require.cache[require.resolve('../src/presentation-stage-v16.17')];
  return require('../src/presentation-stage-v16.17');
};

function classList(initial=[]){
  const values=new Set(initial);
  return {
    contains:name=>values.has(name),
    add:name=>values.add(name),
    remove:name=>values.delete(name),
    toggle(name,force){
      const next=force===undefined?!values.has(name):!!force;
      if(next)values.add(name);else values.delete(name);
      return next;
    }
  };
}

test('V0.16.18 Schultafel button toggles the visible stage board, not only the timeline clip',()=>{
  const {bindLegacyBoardToggle}=fresh();
  const handlers={};
  const button={textContent:'Einblenden',addEventListener:(type,fn)=>{handlers[type]=fn;}};
  const board={classList:classList()};
  const clip={style:{display:'block'}};
  const cue={textContent:''};
  const doc={getElementById:id=>({toggleBoard:button,boardOverlay:board,boardClip:clip,cue}[id]||null)};

  assert.equal(bindLegacyBoardToggle(doc),true);
  handlers.click({preventDefault(){},stopImmediatePropagation(){}});
  assert.equal(board.classList.contains('show'),true);
  assert.equal(button.textContent,'Ausblenden');
  assert.equal(clip.style.display,'block');

  handlers.click({preventDefault(){},stopImmediatePropagation(){}});
  assert.equal(board.classList.contains('show'),false);
  assert.equal(button.textContent,'Einblenden');
  assert.equal(clip.style.display,'none');
});
