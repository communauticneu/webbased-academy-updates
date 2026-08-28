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
    return true;
  }

  /* V0.16.23 · freigegebene Produktionsoberfläche: globale Navigation bleibt unverändert. */
  function prepareProductionWorkspaceV1623(doc){
    if(!doc)return false;
    const vortrag=doc.getElementById('vortragView');
    const workspace=vortrag?.querySelector?.(':scope > .workspace');
    const scenesCol=workspace?.querySelector?.('.scenecol');
    const centerCol=workspace?.querySelector?.('.centercol');
    const legacyControls=workspace?.querySelector?.('.controls');
    const media=vortrag?.querySelector?.(':scope > .media-library');
    if(!vortrag||!workspace||!scenesCol||!centerCol||!media)return false;

    workspace.classList.add('v1623-production-workspace');
    scenesCol.classList.add('v1623-scenes-workspace');
    centerCol.classList.add('v1623-stage-workspace');
    media.classList.add('v1623-media-workspace');
    workspace.appendChild(media);
    if(legacyControls){
      legacyControls.classList.add('v1623-legacy-controls');
      legacyControls.setAttribute('aria-hidden','true');
    }

    const timeline=centerCol.querySelector('.timeline-v3');
    if(timeline)timeline.classList.add('v1623-hidden-timeline');

    let stageControls=centerCol.querySelector('.v1623-stage-controls');
    if(!stageControls){
      stageControls=doc.createElement('div');
      stageControls.className='v1623-stage-controls';
      const progress=doc.createElement('div');
      progress.className='v1623-progress-row';
      progress.innerHTML='<span>00:00.0</span><div class="v1623-progress-line"><i></i></div><span>00:40.0</span>';
      const total=doc.createElement('div');
      total.className='v1623-total';
      total.textContent='Gesamtdauer 40.0 s';
      const buttons=doc.createElement('div');
      buttons.className='v1623-stage-buttons';
      const specs=[
        ['▶ Vorschau','freeTalkPlay','v160Start'],
        ['Ⅱ Pause','freeTalkPause','v160Pause'],
        ['■ Stop','freeTalkStop','v160Pause'],
        ['↻ Zurücksetzen','freeTalkReset','v160Reset']
      ];
      specs.forEach(([label,primaryId,fallbackId])=>{
        const button=doc.createElement('button');
        button.type='button';
        button.className=label.includes('Vorschau')?'btn primary':'btn';
        button.textContent=label;
        button.addEventListener('click',()=>{
          const target=doc.getElementById(primaryId)||doc.getElementById(fallbackId);
          target?.click?.();
        });
        buttons.appendChild(button);
      });
      stageControls.append(progress,total,buttons);
      centerCol.appendChild(stageControls);
    }

    let editor=workspace.querySelector('.v1623-scene-editor');
    if(!editor){
      editor=doc.createElement('aside');
      editor.className='v1623-scene-editor';
      const title=doc.createElement('h2');
      title.textContent='Szene bearbeiten';
      const meta=doc.createElement('div');
      meta.className='v1623-editor-meta';
      meta.textContent='Szene 1 von 4 · Gesamtdauer 40.0 s';
      const body=doc.createElement('div');
      body.className='v1623-editor-body';
      body.innerHTML=`
        <div class="v1623-field-grid">
          <label>Szenenname<input id="v1623SceneName" value="Avatar · Einstieg"></label>
          <label>Dauer (Sek.)<input id="v1623SceneDuration" value="10.0"></label>
        </div>
        <div class="v1623-field-grid">
          <label>Darstellungsart<select id="v1623SceneType"><option>Avatar</option><option>Tafel / Präsentationsmedium</option><option>Grafik / 3D</option></select></label>
          <label>Avatar-Ausschnitt<select id="v1623AvatarCrop"><option>Bis Nabel</option><option>Ganzkörper</option><option>Ohne Avatar</option></select></label>
        </div>
        <div class="v1623-section"><strong>Avatar & Darstellung</strong>
          <label>Avatar<select><option>Lokaler Testavatar</option><option>HeyGen Testavatar</option></select></label>
          <div class="v1623-field-grid"><label>Position<select><option>Rechts</option><option>Links</option><option>Mitte</option></select></label><label>Größe<input type="range" min="40" max="120" value="80"></label></div>
        </div>
        <div class="v1623-section"><strong>Präsentationsmedium</strong>
          <div class="v1623-medium-grid"><button type="button" class="active"><span>▰</span>Tafel</button><button type="button"><span>▱</span>Flipchart</button><button type="button"><span>□</span>Whiteboard</button><button type="button"><span>＋</span>Benutzerdefiniert</button></div>
        </div>
        <div class="v1623-section"><strong>Tafel / Inhalt</strong>
          <label>Modus<select><option>Text & Grafik</option><option>Nur Text</option><option>Nur Grafik</option></select></label>
          <button type="button" class="btn v1623-edit-content">✎ Inhalt bearbeiten</button>
        </div>
        <div class="v1623-section"><strong>Hintergrund</strong>
          <div class="v1623-background-grid"><button type="button" class="active"><span class="room"></span>Raum</button><button type="button"><span class="board"></span>Schultafel</button><button type="button"><span class="custom">＋</span>Benutzerdefiniert</button></div>
        </div>`;
      editor.append(title,meta,body);
      workspace.appendChild(editor);
    }

    const sceneName=editor.querySelector('#v1623SceneName');
    const duration=editor.querySelector('#v1623SceneDuration');
    const meta=editor.querySelector('.v1623-editor-meta');
    const scenes=Array.from(doc.querySelectorAll('#sceneList .scene'));
    const durations=['10.0','15.0','8.0','7.0'];
    scenes.forEach((scene,index)=>{
      if(scene.dataset.v1623Bound==='1')return;
      scene.dataset.v1623Bound='1';
      scene.addEventListener('click',()=>{
        scenes.forEach(item=>item.classList.remove('active'));
        scene.classList.add('active');
        const sceneTitle=scene.querySelector('.t')?.textContent||`Szene ${index+1}`;
        if(sceneName)sceneName.value=sceneTitle.replace('Avatar-','Avatar · ');
        if(duration)duration.value=durations[index]||'10.0';
        if(meta)meta.textContent=`Szene ${index+1} von ${scenes.length} · Gesamtdauer 40.0 s`;
      });
    });

    if(!doc.getElementById('v1623ProductionWorkspaceStyle')){
      const style=doc.createElement('style');
      style.id='v1623ProductionWorkspaceStyle';
      style.textContent=`
        @media (min-width:1600px){
          #vortragView{grid-template-rows:auto minmax(0,1fr)!important;gap:8px!important}
          #vortragView > .v1623-production-workspace{
            display:grid!important;
            grid-template-columns:240px minmax(0,1fr) 430px!important;
            grid-template-rows:minmax(0,1fr) 178px!important;
            grid-template-areas:"scenes stage editor" "media media editor"!important;
            gap:10px!important;height:100%!important;min-height:0!important;overflow:hidden!important;
          }
          .v1623-scenes-workspace{grid-area:scenes!important;height:100%!important;min-height:0!important;overflow:auto!important;background:#091722!important;border-color:#315e76!important;padding:12px!important}
          .v1623-stage-workspace{grid-area:stage!important;display:grid!important;grid-template-rows:minmax(0,1fr) 86px!important;gap:8px!important;height:100%!important;min-height:0!important;overflow:hidden!important}
          .v1623-scene-editor{grid-area:editor!important;background:#0d1b26!important;border:1px solid #315e76!important;border-radius:14px!important;padding:14px!important;overflow:auto!important;color:#eef6fb!important}
          .v1623-media-workspace{grid-area:media!important;height:178px!important;margin:0!important;min-height:0!important;overflow:hidden!important}
          .v1623-legacy-controls,.v1623-hidden-timeline{display:none!important}
          .v1623-scene-head{padding:2px 2px 10px!important;border-bottom:1px solid #234052!important;margin-bottom:10px!important;position:relative!important}
          .v1623-scene-title{font-size:17px!important;font-weight:700!important;color:#eef6fb!important}
          .v1623-scene-sub{font-size:12px!important;color:#8fa8b8!important;margin-top:3px!important}
          .v1623-scene-count{position:absolute!important;right:2px!important;top:2px!important;font-size:11px!important;color:#7fdcff!important;border:1px solid #28516a!important;border-radius:999px!important;padding:3px 7px!important}
          .v1623-scenes-workspace .scene-list{gap:8px!important}
          .v1623-scenes-workspace .scene{min-height:64px!important;padding:10px 11px!important;position:relative!important;border-radius:11px!important;background:#0b1b27!important;border-color:#26495d!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
          .v1623-scenes-workspace .scene.active{background:#123148!important;border-color:#4cc8ff!important;box-shadow:0 0 0 1px rgba(76,200,255,.14)!important}
          .v1623-scenes-workspace .scene.active:before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;background:#4cc8ff;border-radius:0 3px 3px 0}
          .v1623-stage-workspace .monitor-card{height:100%!important;min-height:0!important;padding:8px!important}
          .v1623-stage-workspace .stage{height:100%!important;width:auto!important;max-width:100%!important;aspect-ratio:16/9!important;margin:auto!important}
          .v1623-stage-controls{display:grid!important;grid-template-rows:auto auto 1fr!important;align-items:center!important;padding:4px 8px!important}
          .v1623-progress-row{display:grid;grid-template-columns:auto 1fr auto;gap:9px;align-items:center;font-size:11px;color:#9eb4c0}.v1623-progress-line{height:5px;background:#07141d;border:1px solid #234052;border-radius:999px;overflow:hidden}.v1623-progress-line i{display:block;width:0;height:100%;background:#4cc8ff}.v1623-total{text-align:center;font-size:12px;color:#cde2ec;margin:3px 0}.v1623-stage-buttons{display:flex;justify-content:center;gap:7px}.v1623-stage-buttons .btn{min-width:128px;padding:8px 11px!important;font-size:12px!important}
          .v1623-scene-editor h2{font-size:17px!important;margin:0 0 3px!important}.v1623-editor-meta{font-size:11px;color:#8fa8b8;margin-bottom:14px}.v1623-editor-body label{display:block;font-size:11px;color:#9eb4c0;margin:7px 0 3px}.v1623-editor-body input,.v1623-editor-body select{width:100%;background:#071722;border:1px solid #284c60;color:#eef6fb;border-radius:8px;padding:7px 8px;font-size:12px}.v1623-field-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v1623-section{border-top:1px solid #1f3a4d;margin-top:12px;padding-top:11px}.v1623-section strong{font-size:13px}.v1623-medium-grid,.v1623-background-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:8px}.v1623-background-grid{grid-template-columns:repeat(3,1fr)}.v1623-medium-grid button,.v1623-background-grid button{min-height:78px;background:#0a1821;border:1px solid #26495d;border-radius:9px;color:#b9ced9;font-size:10px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:6px}.v1623-medium-grid button.active,.v1623-background-grid button.active{border-color:#4cc8ff;background:#102b3d}.v1623-medium-grid span{font-size:26px}.v1623-background-grid span{display:block;width:54px;height:34px;border-radius:5px;background:linear-gradient(135deg,#3c4b52,#101820)}.v1623-background-grid span.board{background:#1d2a25}.v1623-background-grid span.custom{display:grid;place-items:center;background:#0a1821;border:1px dashed #45697c;font-size:18px}.v1623-edit-content{width:100%;margin-top:9px!important}
          .v1623-media-workspace .media-grid{grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:8px!important}.v1623-media-workspace .media-item{height:104px!important}.v1623-media-workspace .media-item .thumb{height:72px!important}
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
    prepareProductionWorkspaceV1623(doc);
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

  return {syncPresentationStage,transitionDurationMs,animateExitSnapshot,syncLegacyBoardContent,setAcademyBoardVisible,resetFixedAcademyStage,bindLegacyBoardToggle,bindLegacyBoardBridge,bindFixedProductionRoom,prepareSceneSidebarV1623,prepareProductionWorkspaceV1623,install};
});
