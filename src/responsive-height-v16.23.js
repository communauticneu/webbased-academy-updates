(function(root){
  'use strict';

  function px(value){
    const number=parseFloat(value);
    return Number.isFinite(number)?number:0;
  }

  function syncProductionWorkspaceHeightV1623(doc){
    if(!doc)return false;
    const vortrag=doc.getElementById('vortragView');
    const view=doc.defaultView||root;
    if(!vortrag||!view)return false;

    const workspace=vortrag.querySelector('.v1623-production-workspace');
    const stageWorkspace=vortrag.querySelector('.v1623-stage-workspace');
    const media=vortrag.querySelector('.v1623-media-workspace');
    const controls=vortrag.querySelector('.v1623-stage-controls');
    const monitor=vortrag.querySelector('.monitor-card');
    const stage=vortrag.querySelector('.v1623-stage-workspace .stage');

    if(view.innerWidth<=1250){
      vortrag.style.removeProperty('height');
      vortrag.style.removeProperty('--v1623-stage-max-height');
      stage?.style?.removeProperty?.('max-height');
      return true;
    }

    const top=Math.max(0,vortrag.getBoundingClientRect().top);
    const bottomReserve=18;
    const available=Math.max(0,Math.floor(view.innerHeight-top-bottomReserve));
    vortrag.style.setProperty('height',`${available}px`,'important');

    if(!workspace||!stageWorkspace||!media||!controls||!monitor||!stage)return true;

    const workspaceStyle=view.getComputedStyle?.(workspace);
    const stageWorkspaceStyle=view.getComputedStyle?.(stageWorkspace);
    const workspaceGap=px(workspaceStyle?.rowGap||workspaceStyle?.gap);
    const stageGap=px(stageWorkspaceStyle?.rowGap||stageWorkspaceStyle?.gap);
    const mediaHeight=media.getBoundingClientRect().height;
    const controlsHeight=controls.getBoundingClientRect().height;
    const monitorTopChrome=Math.max(0,stage.getBoundingClientRect().top-monitor.getBoundingClientRect().top);
    const monitorBottomChrome=Math.max(0,monitor.getBoundingClientRect().bottom-stage.getBoundingClientRect().bottom);
    const stageAvailable=Math.max(0,Math.floor(available-mediaHeight-workspaceGap-controlsHeight-stageGap-monitorTopChrome-monitorBottomChrome));

    vortrag.style.setProperty('--v1623-stage-max-height',`${stageAvailable}px`);
    stage.style.setProperty('max-height',`${stageAvailable}px`,'important');
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
