(function(root){
  'use strict';

  function px(value){
    const number=parseFloat(value);
    return Number.isFinite(number)?number:0;
  }

  function ensureResponsiveLayoutStyle(doc){
    if(!doc||doc.getElementById('v1623ResponsiveLayoutGuard'))return;
    const style=doc.createElement('style');
    style.id='v1623ResponsiveLayoutGuard';
    style.textContent=`
      @media (min-width:1251px){
        .v1623-scene-editor{overflow-x:hidden!important;min-width:0!important}
        .v1623-editor-body,.v1623-section{min-width:0!important;max-width:100%!important}
        .v1623-medium-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;min-width:0!important;max-width:100%!important}
        .v1623-background-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;min-width:0!important;max-width:100%!important}
        .v1623-medium-grid button,.v1623-background-grid button{min-width:0!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;padding-left:4px!important;padding-right:4px!important}
        .v1623-media-workspace .media-grid{grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:auto!important;gap:8px!important;overflow-x:hidden!important;overflow-y:hidden!important;padding-bottom:0!important}
        .v1623-media-workspace .media-item,.v1623-media-workspace .v1623-import-tile{height:86px!important;min-height:86px!important;padding:5px!important}
        .v1623-media-workspace .media-item .thumb{height:54px!important}
        .v1623-media-workspace .media-item .name{font-size:10px!important;margin-top:4px!important}
        .v1623-media-workspace .dropzone{display:none!important}
      }
      @media (min-width:1251px) and (max-height:1050px){
        .v1623-scene-editor{overflow-y:hidden!important;padding:8px!important}
        .v1623-scene-editor h2{font-size:15px!important;margin-bottom:2px!important}
        .v1623-editor-meta{margin-bottom:6px!important}
        .v1623-editor-body label{margin:3px 0 2px!important;font-size:10px!important}
        .v1623-editor-body input,.v1623-editor-body select{padding:5px 6px!important;font-size:11px!important}
        .v1623-section{margin-top:6px!important;padding-top:6px!important}
        .v1623-medium-grid,.v1623-background-grid{gap:4px!important;margin-top:4px!important}
        .v1623-edit-content{margin-top:5px!important;padding-top:6px!important;padding-bottom:6px!important}
        .v1623-media-workspace .media-head{margin-bottom:5px!important}
      }
    `;
    doc.head?.appendChild(style);
  }

  function syncProductionWorkspaceHeightV1623(doc){
    if(!doc)return false;
    const vortrag=doc.getElementById('vortragView');
    const view=doc.defaultView||root;
    if(!vortrag||!view)return false;
    ensureResponsiveLayoutStyle(doc);

    const workspace=vortrag.querySelector('.v1623-production-workspace');
    const monitor=vortrag.querySelector('.monitor-card');
    const stage=vortrag.querySelector('.v1623-stage-workspace .stage');
    const media=vortrag.querySelector('.v1623-media-workspace');
    const controls=vortrag.querySelector('.v1623-stage-controls');
    const stageWorkspace=stage?.closest?.('.v1623-stage-workspace');

    if(view.innerWidth<=1250){
      vortrag.style.removeProperty('height');
      vortrag.style.removeProperty('--v1623-stage-max-height');
      vortrag.style.removeProperty('min-height');
      workspace?.style?.removeProperty?.('grid-template-rows');
      stageWorkspace?.style?.removeProperty?.('grid-template-rows');
      media?.style?.removeProperty?.('height');
      media?.style?.removeProperty?.('min-height');
      monitor?.style?.removeProperty?.('height');
      monitor?.style?.removeProperty?.('display');
      monitor?.style?.removeProperty?.('flex-direction');
      monitor?.style?.removeProperty?.('align-items');
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

    if(!workspace||!monitor||!stage||!stageWorkspace)return true;

    const workspaceStyle=view.getComputedStyle?.(workspace);
    const monitorStyle=view.getComputedStyle?.(monitor);
    const toolbar=monitor.querySelector('.monitor-toolbar');
    const toolbarStyle=toolbar?view.getComputedStyle?.(toolbar):null;
    const stageWorkspaceStyle=view.getComputedStyle?.(stageWorkspace);
    const mediaStyle=media?view.getComputedStyle?.(media):null;
    const mediaHead=media?.querySelector?.('.media-head');
    const mediaGrid=media?.querySelector?.('.media-grid');
    const mediaHeadStyle=mediaHead?view.getComputedStyle?.(mediaHead):null;

    const mediaContentHeight=Math.ceil(
      px(mediaStyle?.paddingTop)+
      px(mediaStyle?.paddingBottom)+
      (mediaHead?.getBoundingClientRect().height||0)+
      px(mediaHeadStyle?.marginBottom)+
      (mediaGrid?.scrollHeight||mediaGrid?.getBoundingClientRect().height||0)+
      8
    );
    const mediaHeight=Math.max(118,mediaContentHeight);
    const controlsHeight=controls?.getBoundingClientRect().height||0;
    const workspaceGap=px(workspaceStyle?.rowGap||workspaceStyle?.gap);
    const stageGap=px(stageWorkspaceStyle?.rowGap||stageWorkspaceStyle?.gap);
    const toolbarHeight=toolbar?.getBoundingClientRect().height||0;
    const toolbarMarginBottom=px(toolbarStyle?.marginBottom);
    const monitorChromeHeight=px(monitorStyle?.paddingTop)+px(monitorStyle?.paddingBottom)+toolbarHeight+toolbarMarginBottom;

    const monitorWidth=Math.max(0,Math.floor(monitor.clientWidth-px(monitorStyle?.paddingLeft)-px(monitorStyle?.paddingRight)));
    const stageSlotHeight=Math.max(0,Math.floor(available-mediaHeight-controlsHeight-workspaceGap-stageGap-monitorChromeHeight));
    const stageWidth=Math.min(monitorWidth,Math.floor(stageSlotHeight*16/9));
    const stageHeight=Math.floor(stageWidth*9/16);
    const monitorHeight=monitorChromeHeight+stageHeight;
    const stageRowHeight=monitorHeight+stageGap+controlsHeight;

    workspace.style.setProperty('grid-template-rows',`${stageRowHeight}px ${mediaHeight}px`,'important');
    stageWorkspace.style.setProperty('grid-template-rows',`${monitorHeight}px ${controlsHeight}px`,'important');
    media?.style?.setProperty('height',`${mediaHeight}px`,'important');
    media?.style?.setProperty('min-height',`${mediaHeight}px`,'important');
    vortrag.style.setProperty('--v1623-stage-max-height',`${stageHeight}px`);
    monitor.style.setProperty('height',`${monitorHeight}px`,'important');
    monitor.style.setProperty('display','flex','important');
    monitor.style.setProperty('flex-direction','column','important');
    monitor.style.setProperty('align-items','center','important');
    toolbar?.style?.setProperty?.('align-self','stretch','important');
    stage.style.setProperty('flex','0 0 auto','important');
    stage.style.setProperty('max-width','none','important');
    stage.style.setProperty('max-height','none','important');
    stage.style.setProperty('min-height','0','important');
    stage.style.setProperty('aspect-ratio','16 / 9','important');
    stage.style.setProperty('width',`${stageWidth}px`,'important');
    stage.style.setProperty('height',`${stageHeight}px`,'important');
    stage.style.setProperty('margin','0 auto','important');
    return true;
  }

  function install(doc){
    if(!doc)return null;
    const view=doc.defaultView||root;
    ensureResponsiveLayoutStyle(doc);
    const sync=()=>syncProductionWorkspaceHeightV1623(doc);
    const settle=()=>view?.setTimeout?.(sync,120);
    sync();
    view?.setTimeout?.(sync,1000);
    view?.addEventListener?.('resize',settle);
    return {disconnect(){view?.removeEventListener?.('resize',settle);}};
  }

  const api={syncProductionWorkspaceHeightV1623,install};
  if(root)root.AcademyResponsiveHeightV1623=api;
  if(root&&root.document){
    const boot=()=>install(root.document);
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});
    else boot();
  }
})(typeof globalThis!=='undefined'?globalThis:this);
