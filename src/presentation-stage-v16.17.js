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
    const sync=()=>syncPresentationStage(doc);
    sync();
    if(typeof MutationObserver!=='function')return null;
    const observer=new MutationObserver(sync);
    observer.observe(doc.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-hidden','data-position','data-medium','data-size']});
    return observer;
  }

  return {syncPresentationStage,install};
});
