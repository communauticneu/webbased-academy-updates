(function(){
'use strict';
let top=20;
function layerFor(node){
  if(node?.closest?.('.academy-postit-paper')) return document.getElementById('academyPostItLayer');
  if(node?.closest?.('.academy-text-object')) return document.getElementById('academyTextObjectLayer');
  return null;
}
function raiseLayer(layer){if(!layer)return;top+=1;layer.style.zIndex=String(top);}
function raiseFrom(target){raiseLayer(layerFor(target));}
function raiseNewIn(layerId){
  const layer=document.getElementById(layerId);if(!layer)return;
  const observer=new MutationObserver(records=>{
    if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&(n.matches?.('.academy-postit-paper,.academy-text-object')||n.querySelector?.('.academy-postit-paper,.academy-text-object'))))) raiseLayer(layer);
  });
  observer.observe(layer,{childList:true,subtree:false});
}
document.addEventListener('pointerdown',e=>raiseFrom(e.target),true);
document.addEventListener('dblclick',e=>raiseFrom(e.target),true);
const start=()=>{raiseNewIn('academyPostItLayer');raiseNewIn('academyTextObjectLayer');};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0),{once:true});else setTimeout(start,0);
window.AcademyContentStack={raise:raiseFrom,getTop:()=>top};
})();