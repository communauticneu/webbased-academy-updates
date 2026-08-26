(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.AcademyPresentationStage=api;

  if(root&&root.document){
    const boot=()=>api.install(root.document);
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});
    else boot();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function syncPresentationStage(doc){
    if(!doc)return false;
    const stage=doc.querySelector('.stage');
    const surface=doc.getElementById('presentationSurface');
    if(!stage)return false;
    const shouldShow=!!surface&&surface.classList.contains('is-visible')&&surface.getAttribute('aria-hidden')!=='true';
    stage.classList.toggle('v1617-presentation-active',shouldShow);
    return shouldShow;
  }

  function install(doc){
    if(!doc)return null;
    const stage=doc.querySelector('.stage');
    if(!stage)return null;
    const sync=()=>syncPresentationStage(doc);
    let surfaceObserver=null;
    let observedSurface=null;

    function watchSurface(){
      const surface=doc.getElementById('presentationSurface');
      if(surface===observedSurface)return;
      surfaceObserver?.disconnect();
      surfaceObserver=null;
      observedSurface=surface||null;
      if(surface&&typeof MutationObserver==='function'){
        surfaceObserver=new MutationObserver(sync);
        surfaceObserver.observe(surface,{attributes:true,attributeFilter:['class','aria-hidden','data-position','data-medium','data-size']});
      }
      sync();
    }

    watchSurface();
    if(typeof MutationObserver!=='function')return null;
    const stageObserver=new MutationObserver(()=>watchSurface());
    stageObserver.observe(stage,{childList:true,subtree:true});

    return {
      disconnect(){
        stageObserver.disconnect();
        surfaceObserver?.disconnect();
      }
    };
  }

  return {syncPresentationStage,install};
});
