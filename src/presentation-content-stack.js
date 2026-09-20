(function(){
'use strict';
const TEXT_BACK=4,TEXT_FRONT=5,POSTIT_BACK=4,POSTIT_FRONT=5;
const watched=new WeakSet();
function textLayer(){return document.getElementById('academyTextObjectLayer');}
function postitHost(){return document.getElementById('academyPostitV29Host');}
function textObject(node){return node?.closest?.('.academy-text-object')||null;}
function isPostit(node){const host=postitHost();return !!(host&&(node===host||node?.closest?.('#academyPostitV29Host')));}
function setTextFront(){
 const layer=textLayer(),host=postitHost(); if(!layer)return;
 layer.style.zIndex=String(TEXT_FRONT); if(host)host.style.zIndex=String(POSTIT_BACK);
}
function setPostitFront(){
 const layer=textLayer(),host=postitHost(); if(!host)return;
 host.style.zIndex=String(POSTIT_FRONT); if(layer)layer.style.zIndex=String(TEXT_BACK);
}
function raiseFrom(target){if(textObject(target))setTextFront();else if(isPostit(target))setPostitFront();}
function watchText(layer){
 if(!layer||watched.has(layer))return;watched.add(layer);
 new MutationObserver(records=>{if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&n.matches?.('.academy-text-object'))))setTextFront();}).observe(layer,{childList:true});
}
function watchPostit(host){
 if(!host||watched.has(host)||!host.shadowRoot)return;watched.add(host);
 const stage=host.shadowRoot.getElementById('stage');if(!stage)return;
 new MutationObserver(records=>{if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&n.matches?.('.note'))))setPostitFront();}).observe(stage,{childList:true});
}
function discover(){watchText(textLayer());watchPostit(postitHost());}
document.addEventListener('pointerdown',e=>raiseFrom(e.target),true);
document.addEventListener('dblclick',e=>raiseFrom(e.target),true);
new MutationObserver(discover).observe(document.documentElement,{childList:true,subtree:true});
discover();
window.AcademyContentStack={raise:raiseFrom};
})();