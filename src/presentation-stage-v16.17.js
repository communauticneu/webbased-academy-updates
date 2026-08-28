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
    if(visible){
      syncLegacyBoardContent(doc,surface);
      const avatar=doc.getElementById('avatar');
      if(avatar){
        avatar.classList.remove('hidden');
        avatar.classList.add('medium');
      }
      const graphic=doc.getElementById('fullGraphic');
      graphic?.classList?.remove?.('show');
      doc.querySelectorAll?.('[data-camera]')?.forEach?.(button=>button.classList.toggle('active',button.dataset.camera==='medium'));
    }
    syncPresentationStage(doc);
    return true;
  }

  function resetFixedAcademyStage(doc){
    if(!doc)return false;
    const fixedPane=doc.getElementById('fixedTestPane');
    if(fixedPane&&fixedPane.hidden)return false;
    const stage=doc.querySelector('.stage');
    const avatar=doc.getElementById('avatar');
    const surface=doc.getElementById('presentationSurface');
    if(!stage||!avatar)return false;
    stage.classList.add('v169-fixed-test-active');
    avatar.classList.remove('hidden','point');
    avatar.classList.add('medium');
    doc.getElementById('boardOverlay')?.classList?.remove?.('show');
    doc.getElementById('fullGraphic')?.classList?.remove?.('show');
    doc.getElementById('bgScene')?.classList?.remove?.('show');
    doc.querySelectorAll?.('.media.show,.fullscreen-object.show')?.forEach?.(node=>node.classList.remove('show'));
    if(surface){
      surface.classList.remove('is-visible');
      surface.setAttribute('aria-hidden','true');
    }
    doc.querySelectorAll?.('[data-camera]')?.forEach?.(button=>button.classList.toggle('active',button.dataset.camera==='medium'));
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

  function bindFixedProductionRoom(doc){
    if(!doc)return null;
    const stage=doc.querySelector('.stage');
    const fixedTab=doc.getElementById('fixedTestTab');
    const freeTab=doc.getElementById('freeTalkTab');
    const fixedPane=doc.getElementById('fixedTestPane');
    if(!stage||!fixedTab||!freeTab)return null;
    const activate=()=>stage.classList.add('v169-fixed-test-active');
    const deactivate=()=>stage.classList.remove('v169-fixed-test-active');
    fixedTab.addEventListener('click',()=>{activate();resetFixedAcademyStage(doc);},true);
    freeTab.addEventListener('click',deactivate,true);
    if(!fixedPane||!fixedPane.hidden)activate();
    return {activate,deactivate};
  }

  /* V0.16.23 · Szenenleiste: nur Darstellung/Benennung, bestehende Szenen-DOM und Steuer-IDs bleiben erhalten. */
  function prepareSceneSidebarV1623(doc){
    if(!doc)return false;
    const list=doc.getElementById('sceneList');
    if(!list)return false;
    const labels=['Avatar-Einstieg','Schultafel-Text','Tafel / Grafik','Avatar-Abschluss'];
    const scenes=Array.from(list.querySelectorAll('.scene'));
    labels.forEach((label,index)=>{
      const scene=scenes[index];
      if(!scene)return;
      const number=scene.querySelector('.n');
      const title=scene.querySelector('.t');
      if(number)number.textContent=String(index+1).padStart(2,'0');
      if(title)title.textContent=label;
    });

    /* V0.16.23 · klare Szenenführung */
    let sceneHead=doc.getElementById('v1623SceneHead');
    if(!sceneHead){
      sceneHead=doc.createElement('div');
      sceneHead.id='v1623SceneHead';
      sceneHead.className='v1623-scene-head';
      const title=doc.createElement('div');
      title.className='v1623-scene-title';
      title.textContent='Szenen';
      const sceneSub=doc.createElement('div');
      sceneSub.className='v1623-scene-sub';
      sceneSub.textContent='Vortragsablauf';
      const sceneCount=doc.createElement('div');
      sceneCount.className='v1623-scene-count';
      sceneCount.textContent=`${scenes.length} Szenen`;
      sceneHead.append(title,sceneSub,sceneCount);
      const oldHeading=list.parentElement?.querySelector?.('h2');
      if(oldHeading)oldHeading.style.display='none';
      list.parentElement?.insertBefore?.(sceneHead,list);
    }

    if(!doc.getElementById('v1623SceneSidebarStyle')){
      const style=doc.createElement('style');
      style.id='v1623SceneSidebarStyle';
      style.textContent=`
        @media (min-width:1600px) and (min-aspect-ratio:2/1){
          #vortragView > .workspace{grid-template-columns:240px minmax(0,1fr) 430px!important}
          .scenecol{background:#091722!important;border-color:#315e76!important;padding:12px!important;box-shadow:inset -1px 0 0 rgba(76,200,255,.08)!important}
          .v1623-scene-head{padding:2px 2px 10px!important;border-bottom:1px solid #234052!important;margin-bottom:10px!important;position:relative!important}
          .v1623-scene-title{font-size:17px!important;font-weight:700!important;color:#eef6fb!important;line-height:1.1!important}
          .v1623-scene-sub{font-size:12px!important;color:#8fa8b8!important;margin-top:3px!important}
          .v1623-scene-count{position:absolute!important;right:2px!important;top:2px!important;font-size:11px!important;color:#7fdcff!important;border:1px solid #28516a!important;border-radius:999px!important;padding:3px 7px!important}
          .scenecol .scene-list{gap:8px!important}
          .scenecol .scene{min-height:64px!important;padding:10px 11px!important;position:relative!important;border-radius:11px!important;background:#0b1b27!important;border-color:#26495d!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
          .scenecol .scene .n{font-size:11px!important;color:#79a5bd!important;letter-spacing:.08em!important}
          .scenecol .scene .t{font-size:14px!important;font-weight:600!important;margin-top:4px!important;color:#eaf5fa!important}
          .scenecol .scene.active{background:#123148!important;border-color:#4cc8ff!important;box-shadow:0 0 0 1px rgba(76,200,255,.14)!important}
          .scenecol .scene.active:before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;background:#4cc8ff;border-radius:0 3px 3px 0}
          .scenecol .scene-tools{grid-template-columns:1fr 1fr!important;gap:6px!important;margin-top:9px!important}
          .scenecol .add-scene{margin-top:10px!important;min-height:34px!important;background:#123148!important;border-color:#315e76!important}
        }
      `;
      (doc.head||doc.documentElement).appendChild(style);
    }
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

    prepareSceneSidebarV1623(doc);
    bindLegacyBoardToggle(doc);
    const legacyBoardObserver=bindLegacyBoardBridge(doc);
    const fixedProductionRoom=bindFixedProductionRoom(doc);
    resetFixedAcademyStage(doc);
    setTimeout(()=>{
      fixedProductionRoom?.activate?.();
      resetFixedAcademyStage(doc);
      stage.classList.add('academy-startup-ready');
    },1100);

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
        fixedProductionRoom?.deactivate?.();
      }
    };
  }

  return {syncPresentationStage,transitionDurationMs,animateExitSnapshot,syncLegacyBoardContent,setAcademyBoardVisible,resetFixedAcademyStage,bindLegacyBoardToggle,bindLegacyBoardBridge,bindFixedProductionRoom,prepareSceneSidebarV1623,install};
});
