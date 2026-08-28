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

    const monitor=vortrag.querySelector('.monitor-card');
    const stage=vortrag.querySelector('.v1623-stage-workspace .stage');

    if(view.innerWidth<=1250){
      vortrag.style.removeProperty('height');
      vortrag.style.removeProperty('--v1623-stage-max-height');
      vortrag.style.removeProperty('min-height');
      stage?.style?.removeProperty?.('max-height');
      stage?.style?.removeProperty?.('height');
      stage?.style?.removeProperty?.('width');
      stage?.style?.removeProperty?.('margin');
      return true;
    }

    const top=Math.max(0,vortrag.getBoundingClientRect().top);
    const bottomReserve=18;
    const available=Math.max(0,Math.floor(view.innerHeight-top-bottomReserve));
    vortrag.style.setProperty('height',`${available}px`,'important');
    vortrag.style.setProperty('min-height','0','important');

    if(!monitor||!stage)return true;

    /* The monitor already sits in the stage row. Fit the 16:9 composition only
       into its real content box: toolbar and monitor padding are not stage space. */
    const toolbar=monitor.querySelector('.monitor-toolbar');
    const monitorStyle=view.getComputedStyle?.(monitor);
    const toolbarStyle=toolbar?view.getComputedStyle?.(toolbar):null;
    const monitorWidth=Math.max(0,Math.floor(monitor.clientWidth-px(monitorStyle?.paddingLeft)-px(monitorStyle?.paddingRight)));
    const toolbarHeight=toolbar?.getBoundingClientRect().height||0;
    const toolbarMarginBottom=px(toolbarStyle?.marginBottom);
    const monitorHeight=Math.max(0,Math.floor(monitor.clientHeight-px(monitorStyle?.paddingTop)-px(monitorStyle?.paddingBottom)-toolbarHeight-toolbarMarginBottom));
    const stageWidth=Math.min(monitorWidth,Math.floor(monitorHeight*16/9));
    const stageHeight=Math.floor(stageWidth*9/16);

    vortrag.style.setProperty('--v1623-stage-max-height',`${stageHeight}px`);
    stage.style.setProperty('max-height','none','important');
    stage.style.setProperty('width',`${stageWidth}px`,'important');
    stage.style.setProperty('height',`${stageHeight}px`,'important');
    stage.style.setProperty('margin','auto','important');
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
