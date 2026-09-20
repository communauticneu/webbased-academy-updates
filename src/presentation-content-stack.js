(function(){
'use strict';
let top=20;
function layerFor(node){
  if(node?.closest?.('.academy-postit-paper')) return document.getElementById('academyPostItLayer');
  if(node?.closest?.('.academy-text-object')) return document.getElementById('academyTextObjectLayer');
  return null;
}
function raiseFrom(target){
  const layer=layerFor(target); if(!layer) return;
  top+=1; layer.style.zIndex=String(top);
}
document.addEventListener('pointerdown',e=>raiseFrom(e.target),true);
document.addEventListener('dblclick',e=>raiseFrom(e.target),true);
document.addEventListener('academy:content-created',e=>raiseFrom(e.detail?.element||e.target),true);
window.AcademyContentStack={raise:raiseFrom,getTop:()=>top};
})();