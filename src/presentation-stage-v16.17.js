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
    const liveSurface=!!surface&&surface.classList.contains('is-visible')&&surface.getAttribute('aria-hidden')!=='true';
    const exitingSurface=!!stage.querySelector('.presentation-exit-clone');
    const shouldShow=liveSurface||exitingSurface;
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

  function bindLegacyBoardToggle(doc){
    if(!doc)return false;
    const button=doc.getElementById('toggleBoard');
    const board=doc.getElementById('boardOverlay');
    if(!button||!board)return false;
    const clip=doc.getElementById('boardClip');
    const cue=doc.getElementById('cue');
    const graphic=doc.getElementById('fullGraphic');
    button.addEventListener('click',event=>{
      event?.preventDefault?.();
      event?.stopImmediatePropagation?.();
      const visible=!board.classList.contains('show');
      board.classList.toggle('show',visible);
      if(visible&&graphic)graphic.classList.remove('show');
      if(clip)clip.style.display=visible?'block':'none';
      button.textContent=visible?'Ausblenden':'Einblenden';
      if(cue)cue.textContent=visible?'Schultafel mit Text/Grafik eingeblendet':'Schultafel ausgeblendet';
    },true);
    return true;
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

    bindLegacyBoardToggle(doc);

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
    const stageObserver=new MutationObserver(()=>{watchSurface();sync();});
    stageObserver.observe(stage,{childList:true,subtree:true});

    return {
      disconnect(){
        stageObserver.disconnect();
        surfaceObserver?.disconnect();
      }
    };
  }

  return {syncPresentationStage,transitionDurationMs,animateExitSnapshot,bindLegacyBoardToggle,install};
});
