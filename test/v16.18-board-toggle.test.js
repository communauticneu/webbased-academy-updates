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

test('Schultafel button routes visibility to the Academy presentation surface and removes covering full graphic',()=>{
  const {bindLegacyBoardToggle}=fresh();
  const handlers={};
  const button={textContent:'Einblenden',addEventListener:(type,fn)=>{handlers[type]=fn;}};
  const surface={classList:classList(['presentation-surface']),dataset:{},style:{},setAttribute(){}};
  const graphic={classList:classList(['show'])};
  const clip={style:{display:'block'}};
  const cue={textContent:''};
  const doc={getElementById:id=>({toggleBoard:button,presentationSurface:surface,fullGraphic:graphic,boardClip:clip,cue}[id]||null)};

  assert.equal(bindLegacyBoardToggle(doc),true);
  handlers.click({preventDefault(){},stopImmediatePropagation(){}});
  assert.equal(surface.classList.contains('is-visible'),true);
  assert.equal(surface.classList.contains('presentation-chalkboard'),true);
  assert.equal(surface.dataset.medium,'chalkboard');
  assert.equal(surface.dataset.position,'left');
  assert.equal(surface.dataset.size,'large');
  assert.equal(graphic.classList.contains('show'),false,'full-screen graphic must not cover the board');
  assert.equal(button.textContent,'Ausblenden');
  assert.equal(clip.style.display,'block');

  handlers.click({preventDefault(){},stopImmediatePropagation(){}});
  assert.equal(surface.classList.contains('is-visible'),false);
  assert.equal(button.textContent,'Einblenden');
  assert.equal(clip.style.display,'none');
});
