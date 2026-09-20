(function(){
'use strict';
let top=20;
const watched=new WeakSet();
function layerFor(node){
  if(node?.closest?.('.academy-postit-paper')) return document.getElementById('academyPostItLayer');
  if(node?.closest?.('.academy-text-object')) return document.getElementById('academyTextObjectLayer');
  return null;
}
function raiseLayer(layer){if(!layer)return;top+=1;layer.style.zIndex=String(top);}
function raiseFrom(target){raiseLayer(layerFor(target));}
function watchLayer(layer){
  if(!layer||watched.has(layer))return;
  watched.add(layer);
  new MutationObserver(records=>{
    if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&(n.matches?.('.academy-postit-paper,.academy-text-object')||n.querySelector?.('.academy-postit-paper,.academy-text-object'))))) raiseLayer(layer);
  }).observe(layer,{childList:true});
}
function discoverLayers(){
  watchLayer(document.getElementById('academyPostItLayer'));
  watchLayer(document.getElementById('academyTextObjectLayer'));
}
document.addEventListener('pointerdown',e=>raiseFrom(e.target),true);
document.addEventListener('dblclick',e=>raiseFrom(e.target),true);
new MutationObserver(discoverLayers).observe(document.documentElement,{childList:true,subtree:true});
discoverLayers();
window.AcademyContentStack={raise:raiseFrom,getTop:()=>top};
})();