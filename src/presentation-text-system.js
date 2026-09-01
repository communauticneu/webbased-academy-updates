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
  none:Object.freeze({fonts:Object.freeze({heading:'Arial',normal:'Arial',small:'Arial'}),weights:Object.freeze({heading:700,normal:400,small:400}),sizes:Object.freeze({heading:42,normal:33,small:25}),defaultColor:'#ffffff'}),
  board:Object.freeze({fonts:Object.freeze({heading:'KG Second Chances Sketch',normal:'DJB Chalk It Up',small:'DJB Chalk It Up'}),weights:Object.freeze({heading:400,normal:400,small:400}),sizes:Object.freeze({heading:39,normal:34,small:28}),defaultColor:'#ffffff'})
 });
 let nextId=1;
 let runtime=null;

 function assertKind(kind){if(!TEXT_KINDS.includes(kind))throw new Error(`Unsupported text kind: ${kind}`);}
 function assertMedium(medium){if(!Object.prototype.hasOwnProperty.call(MEDIUM_PROFILES,medium))throw new Error(`Unsupported presentation medium: ${medium}`);}
 function normalizeNumber(value,fallback){return Number.isFinite(value)?value:fallback;}
 function safeSize(size,fallback={width:1,height:1}){return {width:Math.max(1,normalizeNumber(Number(size?.width),fallback.width)),height:Math.max(1,normalizeNumber(Number(size?.height),fallback.height))};}

 function createTextObject(kind,overrides={}){
  assertKind(kind);
  return {id:`academy-text-${nextId++}`,content:typeof overrides.content==='string'?overrides.content:DEFAULT_CONTENT[kind],kind,x:normalizeNumber(overrides.x,48),y:normalizeNumber(overrides.y,48),align:['left','center','right'].includes(overrides.align)?overrides.align:'left',customColor:typeof overrides.customColor==='string'&&overrides.customColor?overrides.customColor:null};
 }
 function normalizeTextObject(input){
  assertKind(input?.kind);
  return {id:typeof input.id==='string'&&input.id?input.id:`academy-text-${nextId++}`,content:typeof input.content==='string'?input.content:DEFAULT_CONTENT[input.kind],kind:input.kind,x:normalizeNumber(input.x,48),y:normalizeNumber(input.y,48),align:['left','center','right'].includes(input.align)?input.align:'left',customColor:typeof input.customColor==='string'&&input.customColor?input.customColor:null};
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

 function projectPositionForResize(position,fromSize,toSize){
  const from=safeSize(fromSize),to=safeSize(toSize);
  return {x:normalizeNumber(position?.x,0)*(to.width/from.width),y:normalizeNumber(position?.y,0)*(to.height/from.height)};
 }
 function clampTextPosition(position,boxSize,surfaceSize){
  const surface=safeSize(surfaceSize),box=safeSize(boxSize);
  return {
   x:Math.max(0,Math.min(normalizeNumber(position?.x,0),Math.max(0,surface.width-box.width))),
   y:Math.max(0,Math.min(normalizeNumber(position?.y,0),Math.max(0,surface.height-box.height)))
  };
 }

 function createEngine(){
  const objects=[];let selectedId=null;let editingId=null;let medium='none';let previewSnapshot=null;
  const find=id=>objects.find(object=>object.id===id)||null;
  const isPreviewing=()=>!!previewSnapshot;
  const copyObjects=()=>objects.map(object=>({...object}));
  function replaceObjects(nextObjects){objects.splice(0,objects.length,...(Array.isArray(nextObjects)?nextObjects.map(normalizeTextObject):[]));selectedId=null;editingId=null;return copyObjects();}
  function addText(kind,overrides={}){if(isPreviewing())return null;const object=createTextObject(kind,overrides);objects.push(object);selectedId=object.id;editingId=null;return {...object};}
  function select(id){if(isPreviewing())return false;if(id===null){selectedId=null;editingId=null;return true;}if(!find(id))return false;selectedId=id;if(editingId&&editingId!==id)editingId=null;return true;}
  function beginEdit(id=selectedId){if(isPreviewing()||!id||!find(id))return false;selectedId=id;editingId=id;return true;}
  function endEdit(){if(isPreviewing()||!editingId)return false;editingId=null;return true;}
  function updateContent(content){if(isPreviewing())return false;const object=find(editingId);if(!object||typeof content!=='string')return false;object.content=content;return true;}
  function deleteSelected(){if(isPreviewing()||!selectedId||editingId)return false;const index=objects.findIndex(object=>object.id===selectedId);if(index<0)return false;objects.splice(index,1);selectedId=null;return true;}
  function moveSelected(dx,dy){if(isPreviewing())return false;const object=find(selectedId);if(!object||editingId)return false;object.x=Math.max(0,object.x+normalizeNumber(dx,0));object.y=Math.max(0,object.y+normalizeNumber(dy,0));return true;}
  function setObjectPosition(id,x,y){const object=find(id);if(!object)return false;object.x=Math.max(0,normalizeNumber(x,object.x));object.y=Math.max(0,normalizeNumber(y,object.y));return true;}
  function reprojectPositions(fromSize,toSize){const from=safeSize(fromSize),to=safeSize(toSize);if(from.width===to.width&&from.height===to.height)return false;objects.forEach(object=>{const next=projectPositionForResize(object,from,to);object.x=next.x;object.y=next.y;});return true;}
  function setAlignment(align){if(isPreviewing())return false;const object=find(selectedId);if(!object||!['left','center','right'].includes(align))return false;object.align=align;return true;}
  function setCustomColor(color){if(isPreviewing())return false;const object=find(selectedId);if(!object)return false;object.customColor=typeof color==='string'&&color?color:null;return true;}
  function duplicateSelected(){if(isPreviewing())return null;const object=find(selectedId);if(!object)return null;const copy=duplicateTextObject(object);objects.push(copy);selectedId=copy.id;editingId=null;return {...copy};}
  function setMedium(nextMedium){assertMedium(nextMedium);if(medium===nextMedium)return false;medium=nextMedium;return true;}
  function beginPreview(nextObjects,nextMedium='none'){
   assertMedium(nextMedium);
   if(!previewSnapshot)previewSnapshot={objects:copyObjects(),selectedId,editingId,medium};
   objects.splice(0,objects.length,...(Array.isArray(nextObjects)?nextObjects.map(normalizeTextObject):[]));
   selectedId=null;editingId=null;medium=nextMedium;return true;
  }
  function endPreview(){
   if(!previewSnapshot)return false;
   const snapshot=previewSnapshot;previewSnapshot=null;
   objects.splice(0,objects.length,...snapshot.objects.map(object=>({...object})));selectedId=snapshot.selectedId;editingId=snapshot.editingId;medium=snapshot.medium;return true;
  }
  return Object.freeze({addText,select,beginEdit,endEdit,updateContent,deleteSelected,moveSelected,setObjectPosition,reprojectPositions,setAlignment,setCustomColor,duplicateSelected,setMedium,replaceObjects,beginPreview,endPreview,getObject:id=>{const object=find(id);return object?{...object}:null;},getObjects:copyObjects,getState:()=>({selectedId,editingId,medium,previewing:isPreviewing()}),getResolvedStyle:id=>{const object=find(id);return object?resolveStyle(object,medium):null;}});
 }

 function ensureStyle(doc){
  if(doc.getElementById('academyTextSystemStyle'))return;
  const style=doc.createElement('style');style.id='academyTextSystemStyle';style.textContent=`
@font-face{font-family:'KG Second Chances Sketch';src:url('./assets/fonts/KGSecondChancesSketch.ttf') format('truetype');font-display:swap}
@font-face{font-family:'DJB Chalk It Up';src:url('./assets/fonts/DJB Chalk It Up.ttf') format('truetype');font-display:swap}
#stage{position:relative!important}
#academyTextObjectLayer{position:absolute;inset:0;z-index:5;overflow:hidden;pointer-events:none}
.stage>.avatar{z-index:10;pointer-events:none}
.academy-text-object{position:absolute;display:inline-flex;align-items:flex-start;width:max-content;max-width:calc(100% - 8px);min-width:56px;box-sizing:border-box;border:1px solid transparent;border-radius:5px;padding:4px 28px 4px 6px;cursor:move;pointer-events:auto;user-select:none}
#academyTextObjectLayer.is-preview .academy-text-object{pointer-events:none;cursor:default;padding-right:6px}
.academy-text-object.is-selected{border-color:rgba(76,200,255,.7);background:rgba(5,18,27,.08)}
#academyTextObjectLayer.is-preview .academy-text-object{border-color:transparent;background:transparent}
.academy-text-content{display:block;min-width:1ch;max-width:100%;white-space:pre-wrap;overflow-wrap:normal;word-break:normal;line-height:1.12;outline:none;user-select:text}
.academy-text-content[contenteditable='true']{cursor:text;box-shadow:0 1px 0 rgba(76,200,255,.8)}
.academy-text-delete{position:absolute;right:3px;top:3px;width:22px;height:22px;border:0;border-radius:4px;background:rgba(0,0,0,.38);color:#fff;cursor:pointer;display:none;padding:0;line-height:22px;text-align:center}
.academy-text-object.is-selected .academy-text-delete{display:block}
#academyTextObjectLayer.is-preview .academy-text-delete{display:none!important}
.academy-text-context{position:absolute;z-index:60;display:flex;gap:4px;align-items:center;padding:5px;border:1px solid rgba(76,200,255,.45);border-radius:7px;background:rgba(5,18,27,.94);box-shadow:0 6px 18px rgba(0,0,0,.3);pointer-events:auto}
.academy-text-context[hidden]{display:none!important}.academy-text-context button{width:30px;height:28px;border:1px solid rgba(255,255,255,.14);border-radius:5px;background:rgba(255,255,255,.07);color:#fff;cursor:pointer}.academy-text-context input[type='color']{width:30px;height:28px;border:0;background:transparent;padding:0;cursor:pointer}
#boardPreview{position:relative!important}
#academyTextMiniatureLayer{position:absolute;inset:0;z-index:5;overflow:hidden;pointer-events:none}
.academy-text-miniature-object{position:absolute;display:block;box-sizing:border-box;white-space:pre-wrap;overflow-wrap:normal;word-break:normal;line-height:1.12;pointer-events:none}
#boardPreview.academy-has-text-objects>.chalk-title{visibility:hidden!important}
#boardPreview.academy-has-text-objects>.chalk-chart{visibility:hidden!important}
#boardPreview.academy-has-text-objects>div:not(#academyTextMiniatureLayer):not(.chalk-title):not(.chalk-chart){visibility:hidden!important}`;doc.head?.appendChild(style);
 }

 function surfaceSize(surface){
  const rect=surface?.getBoundingClientRect?.()||{};
  return {width:Math.max(1,Number(rect.width)||surface?.clientWidth||960),height:Math.max(1,Number(rect.height)||surface?.clientHeight||540)};
 }

 function syncMiniaturePreview(doc,engine,surface){
  const preview=doc.getElementById('boardPreview');if(!preview||!engine)return false;
  const objects=engine.getObjects();
  preview.classList.toggle('academy-has-text-objects',objects.length>0);
  let miniature=doc.getElementById('academyTextMiniatureLayer');
  if(!miniature){miniature=doc.createElement('div');miniature.id='academyTextMiniatureLayer';preview.appendChild(miniature);}
  const source=surfaceSize(surface);
  const targetRect=preview.getBoundingClientRect?.()||{};
  const target={width:Math.max(1,Number(targetRect.width)||preview.clientWidth||260),height:Math.max(1,Number(targetRect.height)||preview.clientHeight||146)};
  const fontScale=Math.min(target.width/source.width,target.height/source.height);
  const live=new Set(objects.map(object=>object.id));
  Array.from(miniature.querySelectorAll('.academy-text-miniature-object')).forEach(node=>{if(!live.has(node.dataset.textId))node.remove();});
  objects.forEach(object=>{
   let node=miniature.querySelector(`[data-text-id="${object.id}"]`);
   if(!node){node=doc.createElement('div');node.className='academy-text-miniature-object';node.dataset.textId=object.id;miniature.appendChild(node);}
   const style=engine.getResolvedStyle(object.id);
   if(node.textContent!==object.content)node.textContent=object.content;
   node.style.left=`${Math.max(0,Math.min(100,(object.x/source.width)*100))}%`;
   node.style.top=`${Math.max(0,Math.min(100,(object.y/source.height)*100))}%`;
   node.style.maxWidth=`${Math.max(1,100-Math.max(0,Math.min(99,(object.x/source.width)*100)))}%`;
   node.style.fontFamily=`'${style.fontFamily}', sans-serif`;
   node.style.fontWeight=String(style.fontWeight);
   node.style.fontSize=`${Math.max(6,style.fontSize*fontScale)}px`;
   node.style.color=style.color;
   node.style.textAlign=object.align;
  });
  return true;
 }

 function reconcileSurfaceGeometry(engine,surface){
  if(!runtime)return false;
  const next=surfaceSize(surface),previous=runtime.surfaceSize;
  if(previous&&(Math.abs(previous.width-next.width)>.5||Math.abs(previous.height-next.height)>.5))engine.reprojectPositions(previous,next);
  runtime.surfaceSize=next;
  return true;
 }

 function render(){
  if(!runtime)return false;
  const {doc,engine,layer,context,surface}=runtime;
  reconcileSurfaceGeometry(engine,surface);
  const state=engine.getState(),objects=engine.getObjects(),surfaceBox=runtime.surfaceSize;
  layer.classList.toggle('is-preview',state.previewing);
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
   node.classList.toggle('is-selected',!state.previewing&&state.selectedId===object.id);
   const isEditing=!state.previewing&&state.editingId===object.id;
   content.contentEditable=isEditing?'true':'false';
   if(!isEditing&&content.textContent!==object.content)content.textContent=object.content;
   content.style.fontFamily=`'${style.fontFamily}', sans-serif`;content.style.fontWeight=String(style.fontWeight);content.style.fontSize=`${style.fontSize}px`;content.style.color=style.color;content.style.textAlign=object.align;
   node.style.left=`${object.x}px`;node.style.top=`${object.y}px`;
   const measured={width:Math.min(Math.max(1,node.offsetWidth||node.scrollWidth||56),Math.max(1,surfaceBox.width-8)),height:Math.min(Math.max(1,node.offsetHeight||node.scrollHeight||28),Math.max(1,surfaceBox.height))};
   const clamped=clampTextPosition(object,measured,surfaceBox);
   if(clamped.x!==object.x||clamped.y!==object.y){engine.setObjectPosition(object.id,clamped.x,clamped.y);node.style.left=`${clamped.x}px`;node.style.top=`${clamped.y}px`;}
  });
  if(state.previewing||!state.selectedId)context.hidden=true;
  syncMiniaturePreview(doc,engine,surface);
  return true;
 }

 function install(doc){
  if(!doc)return false;if(runtime?.doc===doc)return true;
  const stage=doc.querySelector?.('.stage');if(!stage)return false;
  const surface=stage;
  ensureStyle(doc);
  let layer=doc.getElementById('academyTextObjectLayer');if(!layer){layer=doc.createElement('div');layer.id='academyTextObjectLayer';stage.appendChild(layer);}
  let context=doc.getElementById('academyTextContext');if(!context){context=doc.createElement('div');context.id='academyTextContext';context.className='academy-text-context';context.hidden=true;context.innerHTML='<button type="button" data-align="left" title="Linksbündig">≡</button><button type="button" data-align="center" title="Zentriert">≣</button><button type="button" data-align="right" title="Rechtsbündig">≡</button><input type="color" data-text-color title="Schriftfarbe" value="#ffffff"><button type="button" data-duplicate title="Duplizieren">⧉</button>';stage.appendChild(context);}
  const engine=createEngine();runtime={doc,surface,layer,context,engine,surfaceSize:surfaceSize(surface),resizeObserver:null};

  layer.addEventListener('click',event=>{
   if(engine.getState().previewing)return;
   const node=event.target.closest?.('.academy-text-object');if(!node)return;
   engine.select(node.dataset.textId);
   if(event.target.closest?.('.academy-text-delete')){if(engine.deleteSelected())render();return;}
   render();
  });
  layer.addEventListener('dblclick',event=>{
   if(engine.getState().previewing)return;
   const node=event.target.closest?.('.academy-text-object');if(!node)return;
   const content=node.querySelector('.academy-text-content');
   const selection=doc.getSelection?.();
   const range=selection&&selection.rangeCount?selection.getRangeAt(0):null;
   const savedRange=range&&content?.contains?.(range.commonAncestorContainer)?range.cloneRange():null;
   engine.beginEdit(node.dataset.textId);render();content?.focus?.();
   if(savedRange&&selection){selection.removeAllRanges();selection.addRange(savedRange);}
  });
  layer.addEventListener('input',event=>{const content=event.target.closest?.('.academy-text-content');if(content&&runtime.engine.getState().editingId){runtime.engine.updateContent(content.textContent||'');render();}});
  layer.addEventListener('focusout',event=>{if(event.target.closest?.('.academy-text-content')&&engine.getState().editingId){engine.endEdit();render();}});
  layer.addEventListener('contextmenu',event=>{
   if(engine.getState().previewing)return;
   const node=event.target.closest?.('.academy-text-object');if(!node)return;event.preventDefault();engine.select(node.dataset.textId);render();
   const surfaceRect=surface.getBoundingClientRect(),nodeRect=node.getBoundingClientRect();context.style.left=`${Math.max(0,nodeRect.left-surfaceRect.left)}px`;context.style.top=`${Math.max(0,nodeRect.bottom-surfaceRect.top+6)}px`;context.hidden=false;
  });
  layer.addEventListener('pointerdown',event=>{
   if(engine.getState().previewing||event.button!==0||event.target.closest?.('.academy-text-delete,.academy-text-content[contenteditable="true"]'))return;
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
  doc.addEventListener('click',event=>{if(engine.getState().previewing)return;if(!event.target.closest?.('.academy-text-object,.academy-text-context,[data-text-kind]')){engine.select(null);context.hidden=true;render();}});
  doc.addEventListener('academy-presentation-medium-change',event=>{const medium=event.detail?.medium;if(medium==='none'||medium==='board'){engine.setMedium(medium);context.hidden=true;render();}});
  const ResizeObserverCtor=doc.defaultView?.ResizeObserver;
  if(ResizeObserverCtor){runtime.resizeObserver=new ResizeObserverCtor(()=>render());runtime.resizeObserver.observe(surface);}
  else doc.defaultView?.addEventListener?.('resize',()=>render());
  render();return true;
 }

 function addText(kind){if(!runtime)return null;const object=runtime.engine.addText(kind);render();return object;}
 function getEngine(){return runtime?.engine||null;}
 function replaceObjects(objects,medium){if(!runtime)return false;runtime.engine.replaceObjects(objects);if(medium==='none'||medium==='board')runtime.engine.setMedium(medium);render();return true;}
 function beginPreview(objects,medium){if(!runtime)return false;runtime.engine.beginPreview(objects,medium);render();return true;}
 function endPreview(){if(!runtime)return false;const changed=runtime.engine.endPreview();render();return changed;}

 return Object.freeze({TEXT_KINDS,DEFAULT_CONTENT,MEDIUM_PROFILES,createTextObject,resolveStyle,duplicateTextObject,projectPositionForResize,clampTextPosition,createEngine,install,addText,getEngine,replaceObjects,beginPreview,endPreview});
});
