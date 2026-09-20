(function(){
'use strict';
const FRONT=6,BACK=5;
const watched=new WeakSet();
function layers(){return [document.getElementById('academyTextObjectLayer'),document.getElementById('academyPostItLayer')].filter(Boolean);}
function layerFor(node){
  if(node?.closest?.('.academy-postit-paper')) return document.getElementById('academyPostItLayer');
  if(node?.closest?.('.academy-text-object')) return document.getElementById('academyTextObjectLayer');
  return null;
}
function raiseLayer(layer){
  if(!layer)return;
  layers().forEach(item=>item.style.zIndex=String(item===layer?FRONT:BACK));
}
function raiseFrom(target){raiseLayer(layerFor(target));}
function watchLayer(layer){
  if(!layer||watched.has(layer))return;
  watched.add(layer);
  new MutationObserver(records=>{
    if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&(n.matches?.('.academy-postit-paper,.academy-text-object')||n.querySelector?.('.academy-postit-paper,.academy-text-object'))))) raiseLayer(layer);
  }).observe(layer,{childList:true});
}
function discoverLayers(){layers().forEach(watchLayer);}
document.addEventListener('pointerdown',e=>raiseFrom(e.target),true);
document.addEventListener('dblclick',e=>raiseFrom(e.target),true);
new MutationObserver(discoverLayers).observe(document.documentElement,{childList:true,subtree:true});
discoverLayers();
window.AcademyContentStack={raise:raiseFrom};
})();