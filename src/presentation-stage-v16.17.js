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

  function transitionDurationMs(node){
    const raw=node?.style?.transitionDuration||'0.6s';
    const value=parseFloat(raw)||0;
    return raw.includes('ms')?value:value*1000;
  }

  function animateExitSnapshot(stage,snapshot,rootScope){
    if(!stage||!snapshot)return null;
    const clone=snapshot.cloneNode(true);
    clone.removeAttribute('id');
    clone.classList.add('presentation-exit-clone','is-visible');
    clone.dataset.enter=clone.dataset.exit||'fade';
    clone.setAttribute('aria-hidden','true');
    stage.appendChild(clone);
    const durationMs=transitionDurationMs(clone);
    const frame=rootScope&&typeof rootScope.requestAnimationFrame==='function'
      ?rootScope.requestAnimationFrame.bind(rootScope)
      :function(callback){return setTimeout(callback,0);};
    frame(()=>clone.classList.remove('is-visible'));
    setTimeout(()=>clone.remove(),durationMs+80);
    return clone;
  }

  function install(doc){
    if(!doc)return null;
    const stage=doc.querySelector('.stage');
    if(!stage)return null;
    const rootScope=doc.defaultView||(typeof globalThis!=='undefined'?globalThis:null);
    const sync=()=>syncPresentationStage(doc);
    let surfaceObserver=null;
    let observedSurface=null;
    let lastVisibleSnapshot=null;

    function captureVisible(surface){
      if(surface&&surface.classList.contains('is-visible')&&surface.getAttribute('aria-hidden')!=='true'){
        lastVisibleSnapshot=surface.cloneNode(true);
      }
    }

    function watchSurface(){
      const surface=doc.getElementById('presentationSurface');
      if(surface===observedSurface)return;
      surfaceObserver?.disconnect();
      surfaceObserver=null;
      observedSurface=surface||null;
      captureVisible(surface);
      if(surface&&typeof MutationObserver==='function'){
        surfaceObserver=new MutationObserver(records=>{
          const leftVisibleState=records.some(record=>record.attributeName==='class'&&String(record.oldValue||'').includes('is-visible'));
          if(leftVisibleState&&lastVisibleSnapshot){
            animateExitSnapshot(stage,lastVisibleSnapshot,rootScope);
            lastVisibleSnapshot=null;
          }
          captureVisible(surface);
          sync();
        });
        surfaceObserver.observe(surface,{
          attributes:true,
          attributeOldValue:true,
          attributeFilter:['class','aria-hidden','data-position','data-medium','data-size','data-enter','data-exit']
        });
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

  return {syncPresentationStage,transitionDurationMs,animateExitSnapshot,install};
});
