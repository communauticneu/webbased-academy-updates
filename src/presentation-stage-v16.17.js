(function(){
  'use strict';

  function syncPresentationStage(doc=document){
    const stage=doc.querySelector('.stage');
    const surface=doc.getElementById('presentationSurface');
    if(!stage)return;
    const shouldShow=!!surface&&surface.classList.contains('is-visible')&&surface.getAttribute('aria-hidden')!=='true';
    stage.classList.toggle('v1617-presentation-active',shouldShow);
  }

  function install(doc=document){
    const sync=()=>syncPresentationStage(doc);
    sync();
    const observer=new MutationObserver(sync);
    observer.observe(doc.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-hidden','data-position','data-medium','data-size']});
    return observer;
  }

  window.AcademyPresentationStage={syncPresentationStage,install};

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>install(document),{once:true});
  else install(document);
})();
