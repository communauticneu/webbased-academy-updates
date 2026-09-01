(function(root){
'use strict';
function install(doc){
 const stage=doc?.querySelector?.('.stage');
 if(!stage||typeof ResizeObserver!=='function')return false;
 const sync=()=>{
  const system=root.AcademyTextSystem,engine=system?.getEngine?.();
  if(!engine||engine.getState?.().previewing)return;
  const stageRect=stage.getBoundingClientRect();
  const size={width:Math.max(1,stageRect.width),height:Math.max(1,stageRect.height)};
  engine.getObjects().forEach(object=>{
   const node=doc.querySelector?.(`[data-text-id="${object.id}"]`);if(!node)return;
   const rect=node.getBoundingClientRect();
   const x=Math.max(0,rect.left-stageRect.left),y=Math.max(0,rect.top-stageRect.top);
   const ratio=Number.isFinite(object.xRatio)&&Number.isFinite(object.yRatio)?{xRatio:object.xRatio,yRatio:object.yRatio}:system.positionToRatio({x,y},size);
   engine.setLayoutPosition(object.id,x,y,ratio.xRatio,ratio.yRatio);
  });
 };
 const observer=new ResizeObserver(()=>setTimeout(sync,0));observer.observe(stage);sync();return true;
}
root.AcademyTextLayoutSync={install};
if(root.document){const boot=()=>install(root.document);if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis!=='undefined'?globalThis:this);
