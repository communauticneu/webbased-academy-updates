(function(){
'use strict';
const FRONT=5,BACK=4;
const watched=new WeakSet();
function textLayer(){return document.getElementById('academyTextObjectLayer');}
function postitLayer(){return document.getElementById('academyPostitV29Host');}
function layers(){return [textLayer(),postitLayer()].filter(Boolean);}
function layerFor(node){
  if(!node)return null;
  if(node===postitLayer()||node.closest?.('#academyPostitV29Host'))return postitLayer();
  if(node.closest?.('.academy-text-object'))return textLayer();
  return null;
}
function raiseLayer(layer){
  if(!layer)return;
  layers().forEach(item=>item.style.zIndex=String(item===layer?FRONT:BACK));
}
function raiseFrom(target){raiseLayer(layerFor(target));}
function watchText(layer){
  if(!layer||watched.has(layer))return;
  watched.add(layer);
  new MutationObserver(records=>{
    if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&n.matches?.('.academy-text-object'))))raiseLayer(layer);
  }).observe(layer,{childList:true});
}
function watchPostit(host){
  if(!host||watched.has(host)||!host.shadowRoot)return;
  watched.add(host);
  const stage=host.shadowRoot.getElementById('stage');if(!stage)return;
  new MutationObserver(records=>{
    if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&n.matches?.('.note'))))raiseLayer(host);
  }).observe(stage,{childList:true});
}
function discover(){
  watchText(textLayer());
  watchPostit(postitLayer());
}
document.addEventListener('pointerdown',e=>raiseFrom(e.target),true);
document.addEventListener('dblclick',e=>raiseFrom(e.target),true);
new MutationObserver(discover).observe(document.documentElement,{childList:true,subtree:true});
discover();
window.AcademyContentStack={raise:raiseFrom};
})();