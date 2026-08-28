(function(root){
  'use strict';

  function syncProductionWorkspaceHeightV1623(doc){
    if(!doc)return false;
    const vortrag=doc.getElementById('vortragView');
    const view=doc.defaultView||root;
    if(!vortrag||!view)return false;
    const stage=vortrag.querySelector?.('.v1623-stage-workspace .stage');
    if(view.innerWidth<=1250){
      vortrag.style.removeProperty('height');
      stage?.style?.removeProperty?.('max-height');
      return true;
    }
    const top=Math.max(0,vortrag.getBoundingClientRect().top);
    const bottomReserve=18;
    const available=Math.max(0,Math.floor(view.innerHeight-top-bottomReserve));
    const mediaReserve=160;
    const controlsReserve=94;
    const stageAvailable=Math.max(0,available-mediaReserve-controlsReserve);
    vortrag.style.setProperty('height',`${available}px`,'important');
    vortrag.style.setProperty('--v1623-stage-max-height',`${stageAvailable}px`);
    stage?.style?.setProperty?.('max-height',`${stageAvailable}px`,'important');
    return true;
  }

  function install(doc){
    if(!doc)return null;
    const view=doc.defaultView||root;
    const sync=()=>syncProductionWorkspaceHeightV1623(doc);
    sync();
    view?.addEventListener?.('resize',sync);
    return {disconnect(){view?.removeEventListener?.('resize',sync);}};
  }

  const api={syncProductionWorkspaceHeightV1623,install};
  if(root)root.AcademyResponsiveHeightV1623=api;
  if(root&&root.document){
    const boot=()=>install(root.document);
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});
    else boot();
  }
})(typeof globalThis!=='undefined'?globalThis:this);
