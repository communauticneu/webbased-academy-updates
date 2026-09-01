(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.AcademyTextSystem=api;
 if(root&&root.document){
  const boot=()=>api.install(root.document)||setTimeout(()=>api.install(root.document),80);
  if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';

 const TEXT_KINDS=Object.freeze(['heading','normal','small']);
 const DEFAULT_CONTENT=Object.freeze({heading:'Neue Überschrift',normal:'Neuer Text',small:'Neuer Text'});
 const MEDIUM_PROFILES=Object.freeze({
  none:Object.freeze({fonts:Object.freeze({heading:'Arial',normal:'Arial',small:'Arial'}),weights:Object.freeze({heading:700,normal:400,small:400}),sizes:Object.freeze({heading:24,normal:20,small:15}),defaultColor:'#ffffff'}),
  board:Object.freeze({fonts:Object.freeze({heading:'KG Second Chances Sketch',normal:'DJB Chalk It Up',small:'DJB Chalk It Up'}),weights:Object.freeze({heading:400,normal:400,small:400}),sizes:Object.freeze({heading:39,normal:20,small:15}),defaultColor:'#ffffff'})
 });
 let nextId=1;
 let runtime=null;

 function assertKind(kind){if(!TEXT_KINDS.includes(kind))throw new Error(`Unsupported text kind: ${kind}`);}
 function assertMedium(medium){if(!Object.prototype.hasOwnProperty.call(MEDIUM_PROFILES,medium))throw new Error(`Unsupported presentation medium: ${medium}`);}
 function normalizeNumber(value,fallback){return Number.isFinite(value)?value:fallback;}

 function createTextObject(kind,overrides={}){
  assertKind(kind);
  return {id:`academy-text-${nextId++}`,content:typeof overrides.content==='string'?overrides.content:DEFAULT_CONTENT[kind],kind,x:normalizeNumber(overrides.x,48),y:normalizeNumber(overrides.y,48),align:['left','center','right'].includes(overrides.align)?overrides.align:'left',customColor:typeof overrides.customColor==='string'&&overrides.customColor?overrides.customColor:null};
 }

 function resolveStyle(textObject,medium='none'){
  assertKind(textObject?.kind);assertMedium(medium);
  const profile=MEDIUM_PROFILES[medium];
  return {fontFamily:profile.fonts[textObject.kind],fontWeight:profile.weights[textObject.kind],color:textObject.customColor||profile.defaultColor,fontSize:profile.sizes[textObject.kind]};
 }

 function duplicateTextObject(textObject){
  assertKind(textObject?.kind);
  return createTextObject(textObject.kind,{content:textObject.content,x:normalizeNumber(textObject.x,48)+18,y:normalizeNumber(textObject.y,48)+18,align:textObject.align,customColor:textObject.customColor});
 }

 function createEngine(){
  const objects=[];let selectedId=null;let editingId=null;let medium='none';
  const find=id=>objects.find(object=>object.id===id)||null;
  function addText(kind,overrides={}){const object=createTextObject(kind,overrides);objects.push(object);selectedId=object.id;editingId=null;return {...object};}
  function select(id){if(id===null){selectedId=null;editingId=null;return true;}if(!find(id))return false;selectedId=id;if(editingId&&editingId!==id)editingId=null;return true;}
  function beginEdit(id=selectedId){if(!id||!find(id))return false;selectedId=id;editingId=id;return true;}
  function endEdit(){if(!editingId)return false;editingId=null;return true;}
  function updateContent(content){const object=find(editingId);if(!object||typeof content!=='string')return false;object.content=content;return true;}
  function deleteSelected(){if(!selectedId||editingId)return false;const index=objects.findIndex(object=>object.id===selectedId);if(index<0)return false;objects.splice(index,1);selectedId=null;return true;}
  function moveSelected(dx,dy){const object=find(selectedId);if(!object||editingId)return false;object.x=Math.max(0,object.x+normalizeNumber(dx,0));object.y=Math.max(0,object.y+normalizeNumber(dy,0));return true;}
  function setAlignment(align){const object=find(selectedId);if(!object||!['left','center','right'].includes(align))return false;object.align=align;return true;}
  function setCustomColor(color){const object=find(selectedId);if(!object)return false;object.customColor=typeof color==='string'&&color?color:null;return true;}
  function duplicateSelected(){const object=find(selectedId);if(!object)return null;const copy=duplicateTextObject(object);objects.push(copy);selectedId=copy.id;editingId=null;return {...copy};}
  function setMedium(nextMedium){assertMedium(nextMedium);if(medium===nextMedium)return false;medium=nextMedium;return true;}
  return Object.freeze({addText,select,beginEdit,endEdit,updateContent,deleteSelected,moveSelected,setAlignment,setCustomColor,duplicateSelected,setMedium,getObject:id=>{const object=find(id);return object?{...object}:null;},getObjects:()=>objects.map(object=>({...object})),getState:()=>({selectedId,editingId,medium}),getResolvedStyle:id=>{const object=find(id);return object?resolveStyle(object,medium):null;}});
 }

 function ensureStyle(doc){
  if(doc.getElementById('academyTextSystemStyle'))return;
  const style=doc.createElement('style');style.id='academyTextSystemStyle';style.textContent=`
@font-face{font-family:'KG Second Chances Sketch';src:url('./assets/fonts/KGSecondChancesSketch.ttf') format('truetype');font-display:swap}
@font-face{font-family:'DJB Chalk It Up';src:url('./assets/fonts/DJB Chalk It Up.ttf') format('truetype');font-display:swap}
#stage{position:relative!important}
#academyTextObjectLayer{position:absolute;inset:0;z-index:5;overflow:hidden;pointer-events:none}
.stage>.avatar{z-index:10}
.academy-text-object{position:absolute;display:inline-flex;align-items:flex-start;max-width:92%;min-width:56px;box-sizing:border-box;border:1px solid transparent;border-radius:5px;padding:4px 28px 4px 6px;cursor:move;pointer-events:auto;user-select:none}
.academy-text-object.is-selected{border-color:rgba(76,200,255,.7);background:rgba(5,18,27,.08)}
.academy-text-content{display:block;min-width:1ch;max-width:100%;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.12;outline:none;user-select:text}
.academy-text-content[contenteditable='true']{cursor:text;box-shadow:0 1px 0 rgba(76,200,255,.8)}
.academy-text-delete{position:absolute;right:3px;top:3px;width:22px;height:22px;border:0;border-radius:4px;background:rgba(0,0,0,.38);color:#fff;cursor:pointer;display:none;padding:0;line-height:22px;text-align:center}
.academy-text-object.is-selected .academy-text-delete{display:block}
.academy-text-context{position:absolute;z-index:60;display:flex;gap:4px;align-items:center;padding:5px;border:1px solid rgba(76,200,255,.45);border-radius:7px;background:rgba(5,18,27,.94);box-shadow:0 6px 18px rgba(0,0,0,.3);pointer-events:auto}
.academy-text-context[hidden]{display:none!important}.academy-text-context button{width:30px;height:28px;border:1px solid rgba(255,255,255,.14);border-radius:5px;background:rgba(255,255,255,.07);color:#fff;cursor:pointer}.academy-text-context input[type='color']{width:30px;height:28px;border:0;background:transparent;padding:0;cursor:pointer}`;doc.head?.appendChild(style);
 }

 function render(){
  if(!runtime)return false;
  const {doc,engine,layer,context}=runtime,state=engine.getState(),objects=engine.getObjects();
  const live=new Set(objects.map(object=>object.id));
  Array.from(layer.querySelectorAll('.academy-text-object')).forEach(node=>{if(!live.has(node.dataset.textId))node.remove();});
  objects.forEach(object=>{
   let node=layer.querySelector(`[data-text-id="${object.id}"]`);
   if(!node){
    node=doc.createElement('div');node.className='academy-text-object';node.dataset.textId=object.id;
    const content=doc.createElement('div');content.className='academy-text-content';content.spellcheck=false;
    const del=doc.createElement('button');del.type='button';del.className='academy-text-delete';del.setAttribute('aria-label','Text löschen');del.textContent='×';
    node.append(content,del);layer.appendChild(node);
   }
   const content=node.querySelector('.academy-text-content'),style=engine.getResolvedStyle(object.id);
   node.classList.toggle('is-selected',state.selectedId===object.id);node.style.left=`${object.x}px`;node.style.top=`${object.y}px`;
   const isEditing=state.editingId===object.id;content.contentEditable=isEditing?'true':'false';if(!isEditing&&content.textContent!==object.content)content.textContent=object.content;content.style.fontFamily=`'${style.fontFamily}', sans-serif`;content.style.fontWeight=String(style.fontWeight);content.style.fontSize=`${style.fontSize}px`;content.style.color=style.color;content.style.textAlign=object.align;
  });
  if(!state.selectedId)context.hidden=true;
  return true;
 }

 function install(doc){
  if(!doc)return false;if(runtime?.doc===doc)return true;
  const stage=doc.querySelector?.('.stage');if(!stage)return false;
  const surface=stage;
  ensureStyle(doc);
  let layer=doc.getElementById('academyTextObjectLayer');if(!layer){layer=doc.createElement('div');layer.id='academyTextObjectLayer';stage.appendChild(layer);}
  let context=doc.getElementById('academyTextContext');if(!context){context=doc.createElement('div');context.id='academyTextContext';context.className='academy-text-context';context.hidden=true;context.innerHTML='<button type="button" data-align="left" title="Linksbündig">≡</button><button type="button" data-align="center" title="Zentriert">≣</button><button type="button" data-align="right" title="Rechtsbündig">≡</button><input type="color" data-text-color title="Schriftfarbe" value="#ffffff"><button type="button" data-duplicate title="Duplizieren">⧉</button>';stage.appendChild(context);}
  const engine=createEngine();runtime={doc,surface,layer,context,engine};

  layer.addEventListener('click',event=>{
   const node=event.target.closest?.('.academy-text-object');if(!node)return;
   engine.select(node.dataset.textId);
   if(event.target.closest?.('.academy-text-delete')){if(engine.deleteSelected())render();return;}
   render();
  });
  layer.addEventListener('dblclick',event=>{
   const node=event.target.closest?.('.academy-text-object');if(!node)return;
   const content=node.querySelector('.academy-text-content');
   const selection=doc.getSelection?.();
   const range=selection&&selection.rangeCount?selection.getRangeAt(0):null;
   const savedRange=range&&content?.contains?.(range.commonAncestorContainer)?range.cloneRange():null;
   engine.beginEdit(node.dataset.textId);render();content?.focus?.();
   if(savedRange&&selection){selection.removeAllRanges();selection.addRange(savedRange);}
  });
  layer.addEventListener('input',event=>{const content=event.target.closest?.('.academy-text-content');if(content&&runtime.engine.getState().editingId)runtime.engine.updateContent(content.textContent||'');});
  layer.addEventListener('focusout',event=>{if(event.target.closest?.('.academy-text-content')&&engine.getState().editingId){engine.endEdit();render();}});
  layer.addEventListener('contextmenu',event=>{
   const node=event.target.closest?.('.academy-text-object');if(!node)return;event.preventDefault();engine.select(node.dataset.textId);render();
   const surfaceRect=surface.getBoundingClientRect(),nodeRect=node.getBoundingClientRect();context.style.left=`${Math.max(0,nodeRect.left-surfaceRect.left)}px`;context.style.top=`${Math.max(0,nodeRect.bottom-surfaceRect.top+6)}px`;context.hidden=false;
  });
  layer.addEventListener('pointerdown',event=>{
   if(event.button!==0||event.target.closest?.('.academy-text-delete,.academy-text-content[contenteditable="true"]'))return;
   const node=event.target.closest?.('.academy-text-object');if(!node)return;engine.select(node.dataset.textId);render();
   let lastX=event.clientX,lastY=event.clientY;
   const move=moveEvent=>{
    const current=engine.getObject(node.dataset.textId);if(!current)return;
    const surfaceRect=surface.getBoundingClientRect(),nodeRect=node.getBoundingClientRect();
    const rawDx=moveEvent.clientX-lastX,rawDy=moveEvent.clientY-lastY;
    const nextLeft=Math.min(Math.max(0,current.x+rawDx),Math.max(0,surfaceRect.width-nodeRect.width));
    const nextTop=Math.min(Math.max(0,current.y+rawDy),Math.max(0,surfaceRect.height-nodeRect.height));
    engine.moveSelected(nextLeft-current.x,nextTop-current.y);lastX=moveEvent.clientX;lastY=moveEvent.clientY;render();
   };
   const up=()=>{doc.removeEventListener('pointermove',move);doc.removeEventListener('pointerup',up);};doc.addEventListener('pointermove',move);doc.addEventListener('pointerup',up,{once:true});
  });
  context.addEventListener('click',event=>{
   const align=event.target.closest?.('[data-align]')?.dataset.align;if(align){engine.setAlignment(align);render();return;}
   if(event.target.closest?.('[data-duplicate]')){engine.duplicateSelected();context.hidden=true;render();}
  });
  context.querySelector('[data-text-color]')?.addEventListener('input',event=>{engine.setCustomColor(event.target.value);render();});
  doc.addEventListener('keydown',event=>{if(event.key!=='Delete'&&event.key!=='Del')return;const active=doc.activeElement;if(active?.closest?.('.academy-text-content[contenteditable="true"]'))return;if(engine.deleteSelected()){event.preventDefault();context.hidden=true;render();}});
  doc.addEventListener('click',event=>{if(!event.target.closest?.('.academy-text-object,.academy-text-context,[data-text-kind]')){engine.select(null);context.hidden=true;render();}});
  doc.addEventListener('academy-presentation-medium-change',event=>{const medium=event.detail?.medium;if(medium==='none'||medium==='board'){engine.setMedium(medium);context.hidden=true;render();}});
  render();return true;
 }

 function addText(kind){if(!runtime)return null;const object=runtime.engine.addText(kind);render();return object;}
 function getEngine(){return runtime?.engine||null;}

 return Object.freeze({TEXT_KINDS,DEFAULT_CONTENT,MEDIUM_PROFILES,createTextObject,resolveStyle,duplicateTextObject,createEngine,install,addText,getEngine});
});
