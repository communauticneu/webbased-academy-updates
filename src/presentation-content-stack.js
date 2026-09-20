(function(){
'use strict';
const MAX_CONTENT_Z=5;
let serial=0;
const watched=new WeakSet();

function textLayer(){return document.getElementById('academyTextObjectLayer');}
function postitHost(){return document.getElementById('academyPostitV29Host');}
function isText(node){return node?.closest?.('.academy-text-object')||null;}
function isPostitHost(node){const host=postitHost();return host&&(node===host||node?.closest?.('#academyPostitV29Host'))?host:null;}
function itemFor(node){return isText(node)||isPostitHost(node);}

function allItems(){
 const items=[];
 const tl=textLayer(); if(tl) items.push(...tl.querySelectorAll('.academy-text-object'));
 const ph=postitHost(); if(ph) items.push(ph);
 return items;
}
function normalize(active){
 const items=allItems().filter(Boolean);
 const others=items.filter(x=>x!==active);
 others.forEach((el,i)=>{el.style.zIndex=String(Math.min(i+1,MAX_CONTENT_Z-1));});
 if(active) active.style.zIndex=String(MAX_CONTENT_Z);
}
function raise(item){if(!item)return;serial++;normalize(item);}
function raiseFrom(target){raise(itemFor(target));}

function watchText(layer){
 if(!layer||watched.has(layer))return; watched.add(layer);
 new MutationObserver(records=>{
  const added=records.flatMap(r=>Array.from(r.addedNodes)).filter(n=>n.nodeType===1&&n.matches?.('.academy-text-object'));
  if(added.length) raise(added[added.length-1]);
 }).observe(layer,{childList:true});
}
function watchPostit(host){
 if(!host||watched.has(host)||!host.shadowRoot)return; watched.add(host);
 const stage=host.shadowRoot.getElementById('stage'); if(!stage)return;
 new MutationObserver(records=>{
  if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&n.matches?.('.note')))) raise(host);
 }).observe(stage,{childList:true});
}
function discover(){watchText(textLayer());watchPostit(postitHost());}

document.addEventListener('pointerdown',e=>raiseFrom(e.target),true);
document.addEventListener('dblclick',e=>raiseFrom(e.target),true);
new MutationObserver(discover).observe(document.documentElement,{childList:true,subtree:true});
discover();
window.AcademyContentStack={raise:raiseFrom};
})();