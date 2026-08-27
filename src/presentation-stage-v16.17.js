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

  function syncLegacyBoardContent(doc,surface){
    if(!doc||!surface)return;
    const textNode=surface.querySelector?.('.presentation-board-text');
    const graphicNode=surface.querySelector?.('.presentation-board-graphic');
    const boardText=doc.getElementById('boardText');
    const boardStageImage=doc.getElementById('boardStageImage');
    if(textNode)textNode.textContent=boardText?.value||'WISSEN VERSTEHEN.';
    if(graphicNode){
      const src=boardStageImage?.getAttribute?.('src')||boardStageImage?.src||'';
      if(src){graphicNode.src=src;graphicNode.hidden=false;}
      else graphicNode.hidden=true;
    }
  }

  function setAcademyBoardVisible(doc,visible){
    if(!doc)return false;
    const surface=doc.getElementById('presentationSurface');
    if(!surface)return false;
    surface.classList.remove('presentation-flipchart','presentation-whiteboard','presentation-custom');
    surface.classList.add('presentation-chalkboard');
    surface.dataset.medium='chalkboard';
    surface.dataset.position='left';
    surface.dataset.size='large';
    surface.dataset.enter='fade';
    surface.setAttribute('aria-hidden',visible?'false':'true');
    surface.classList.toggle('is-visible',!!visible);
    if(visible)syncLegacyBoardContent(doc,surface);
    syncPresentationStage(doc);
    return true;
  }

  function bindLegacyBoardToggle(doc){
    if(!doc)return false;
    const button=doc.getElementById('toggleBoard');
    const surface=doc.getElementById('presentationSurface');
    if(!button||!surface)return false;
    const clip=doc.getElementById('boardClip');
    const cue=doc.getElementById('cue');
    const graphic=doc.getElementById('fullGraphic');
    button.addEventListener('click',event=>{
      event?.preventDefault?.();
      event?.stopImmediatePropagation?.();
      const visible=!surface.classList.contains('is-visible');
      setAcademyBoardVisible(doc,visible);
      if(visible&&graphic)graphic.classList.remove('show');
      if(clip)clip.style.display=visible?'block':'none';
      button.textContent=visible?'Ausblenden':'Einblenden';
      if(cue)cue.textContent=visible?'Academy-Schultafel mit Text/Grafik eingeblendet':'Schultafel ausgeblendet';
    },true);
    return true;
  }

  function bindLegacyBoardBridge(doc){
    if(!doc||typeof MutationObserver!=='function')return null;
    const legacy=doc.getElementById('boardOverlay');
    if(!legacy)return null;
    const apply=()=>setAcademyBoardVisible(doc,legacy.classList.contains('show'));
    const observer=new MutationObserver(records=>{
      if(records.some(r=>r.attributeName==='class'))apply();
    });
    observer.observe(legacy,{attributes:true,attributeFilter:['class']});
    return observer;
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
    const legacyBoardObserver=bindLegacyBoardBridge(doc);

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

    const boardText=doc.getElementById('boardText');
    boardText?.addEventListener?.('input',()=>{
      const surface=doc.getElementById('presentationSurface');
      if(surface)syncLegacyBoardContent(doc,surface);
    });

    return {
      disconnect(){
        stageObserver.disconnect();
        surfaceObserver?.disconnect();
        legacyBoardObserver?.disconnect();
      }
    };
  }

  return {syncPresentationStage,transitionDurationMs,animateExitSnapshot,syncLegacyBoardContent,setAcademyBoardVisible,bindLegacyBoardToggle,bindLegacyBoardBridge,install};
});
