(function(root){
'use strict';
let timer=null;
function ensureStyle(doc){
 if(doc.getElementById('academyTextMiniatureStyle'))return;
 const style=doc.createElement('style');style.id='academyTextMiniatureStyle';style.textContent=`
#boardPreview{position:relative!important}
#academyTextMiniatureLayer{position:absolute;inset:0;z-index:5;overflow:hidden;pointer-events:none}
.academy-text-miniature-object{position:absolute;display:block;box-sizing:border-box;white-space:pre-wrap;overflow-wrap:normal;word-break:normal;line-height:1.12;pointer-events:none}
#boardPreview.academy-has-text-objects>.chalk-title{visibility:hidden!important}
#boardPreview.academy-has-text-objects>.chalk-chart{visibility:hidden!important}
#boardPreview.academy-has-text-objects>div:not(#academyTextMiniatureLayer):not(.chalk-title):not(.chalk-chart){visibility:hidden!important}`;
 doc.head?.appendChild(style);
}
function sync(doc){
 const preview=doc.getElementById('boardPreview');
 const system=root.AcademyTextSystem;
 const engine=system?.getEngine?.();
 const sourceLayer=doc.getElementById('academyTextObjectLayer');
 const stage=doc.querySelector?.('.stage');
 if(!preview||!engine||!sourceLayer||!stage)return false;
 ensureStyle(doc);
 let miniature=doc.getElementById('academyTextMiniatureLayer');
 if(!miniature){miniature=doc.createElement('div');miniature.id='academyTextMiniatureLayer';preview.appendChild(miniature);}
 const objects=engine.getObjects();
 preview.classList.toggle('academy-has-text-objects',objects.length>0);
 const sourceRect=stage.getBoundingClientRect();
 const targetRect=preview.getBoundingClientRect();
 const source={width:Math.max(1,sourceRect.width),height:Math.max(1,sourceRect.height)};
 const target={width:Math.max(1,targetRect.width||preview.clientWidth||260),height:Math.max(1,targetRect.height||preview.clientHeight||146)};
 const scale=Math.min(target.width/source.width,target.height/source.height);
 const live=new Set(objects.map(object=>object.id));
 Array.from(miniature.querySelectorAll('.academy-text-miniature-object')).forEach(node=>{if(!live.has(node.dataset.textId))node.remove();});
 objects.forEach(object=>{
  const sourceNode=sourceLayer.querySelector(`[data-text-id="${object.id}"]`);
  if(!sourceNode)return;
  const sourceNodeRect=sourceNode.getBoundingClientRect();
  const scaledWidth=Math.max(1,sourceNodeRect.width*scale);
  const scaledHeight=Math.max(1,sourceNodeRect.height*scale);
  const sourceX=Math.max(0,sourceNodeRect.left-sourceRect.left);
  const sourceY=Math.max(0,sourceNodeRect.top-sourceRect.top);
  const left=Math.max(0,Math.min(target.width-scaledWidth,sourceX*scale));
  const top=Math.max(0,Math.min(target.height-scaledHeight,sourceY*scale));
  let node=miniature.querySelector(`[data-text-id="${object.id}"]`);
  if(!node){node=doc.createElement('div');node.className='academy-text-miniature-object';node.dataset.textId=object.id;miniature.appendChild(node);}
  const resolved=engine.getResolvedStyle(object.id);
  node.textContent=object.content;
  node.style.left=`${left}px`;
  node.style.top=`${top}px`;
  node.style.width=`${scaledWidth}px`;
  node.style.minHeight=`${scaledHeight}px`;
  node.style.fontFamily=`'${resolved.fontFamily}', sans-serif`;
  node.style.fontWeight=String(resolved.fontWeight);
  node.style.fontSize=`${Math.max(1,resolved.fontSize*scale)}px`;
  node.style.color=resolved.color;
  node.style.textAlign=object.align;
 });
 return true;
}
function install(doc){
 if(!doc)return false;
 ensureStyle(doc);
 const run=()=>sync(doc);
 ['click','input','pointermove','academy-presentation-medium-change'].forEach(type=>doc.addEventListener(type,run,{passive:true}));
 doc.defaultView?.addEventListener?.('resize',run,{passive:true});
 clearInterval(timer);timer=setInterval(run,160);run();return true;
}
root.AcademyTextMiniature={install,sync};
if(root.document){const boot=()=>install(root.document);if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis!=='undefined'?globalThis:this);
