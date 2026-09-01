(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.FreePresentation=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VALID_KINDS=new Set(['avatar','board','graphic','background']);
  const VALID_AVATAR=new Set(['full','medium','hidden']);
  const VALID_GESTURES=new Set(['front','point']);
  const VALID_TRANSITIONS=new Set(['cut','fade']);
  const VALID_PRESENTATION_MEDIA=new Set(['chalkboard','flipchart','whiteboard','custom']);
  const VALID_MEDIA_POSITIONS=new Set(['left','center','right']);
  const VALID_MEDIA_SIZES=new Set(['small','medium','large']);
  const VALID_MEDIA_EFFECTS=new Set(['cut','fade','slide-left','slide-right','slide-top','slide-bottom']);
  const VALID_TEXT_KINDS=new Set(['heading','normal','small']);
  let idCounter=0;

  const finite=(v,f)=>Number.isFinite(Number(v))?Number(v):f;
  const text=(v,f='')=>typeof v==='string'?v:f;
  const nextId=()=>`scene-${Date.now().toString(36)}-${(++idCounter).toString(36)}`;
  const activeDocument=()=>typeof document!=='undefined'?document:null;
  const activeTextSystem=()=>typeof globalThis!=='undefined'?globalThis.AcademyTextSystem:null;
  const activeTextEngine=()=>activeTextSystem()?.getEngine?.()||null;
  const textMediumForScene=scene=>scene?.kind==='board'?'board':'none';

  function normalizeTextObjects(input){
    if(!Array.isArray(input))return [];
    return input.filter(item=>item&&VALID_TEXT_KINDS.has(item.kind)).map((item,index)=>({
      id:typeof item.id==='string'&&item.id?item.id:`scene-text-${index+1}`,
      content:typeof item.content==='string'?item.content:'',
      kind:item.kind,
      x:Number.isFinite(item.x)?item.x:48,
      y:Number.isFinite(item.y)?item.y:48,
      align:['left','center','right'].includes(item.align)?item.align:'left',
      customColor:typeof item.customColor==='string'&&item.customColor?item.customColor:null
    }));
  }
  const cloneTextObjects=objects=>normalizeTextObjects(objects).map(object=>({...object}));
  const cloneScene=scene=>({...scene,textObjects:cloneTextObjects(scene.textObjects),state:scene.state?{...scene.state}:null});

  function captureEditorText(scenes,index){
    const engine=activeTextEngine();
    if(!engine||engine.getState?.().previewing||!scenes[index])return false;
    scenes[index].textObjects=cloneTextObjects(engine.getObjects?.()||[]);
    return true;
  }
  function loadEditorText(scene){
    const system=activeTextSystem();const engine=activeTextEngine();
    if(!engine||engine.getState?.().previewing)return false;
    const objects=cloneTextObjects(scene?.textObjects||[]),medium=textMediumForScene(scene);
    if(typeof system?.replaceObjects==='function')return system.replaceObjects(objects,medium);
    engine.replaceObjects?.(objects);engine.setMedium?.(medium);return true;
  }
  function beginSceneTextPreview(scene){
    const system=activeTextSystem();const engine=activeTextEngine();
    if(!engine)return false;
    const objects=cloneTextObjects(scene?.textObjects||[]),medium=textMediumForScene(scene);
    if(typeof system?.beginPreview==='function')return system.beginPreview(objects,medium);
    return engine.beginPreview?.(objects,medium)||false;
  }
  function endSceneTextPreview(){
    const system=activeTextSystem();const engine=activeTextEngine();
    if(!engine)return false;
    if(typeof system?.endPreview==='function')return system.endPreview();
    return engine.endPreview?.()||false;
  }

  function normalizeScene(input,index=0){
    const s=input&&typeof input==='object'?input:{};
    const state=s.state&&typeof s.state==='object'?s.state:{};
    const camera=s.avatarMode||s.camera||state.camera;
    const boardFlag=s.kind==='board'||s.board===true||state.board===true;
    const graphicFlag=s.kind==='graphic'||!!s.mediumId||!!state.object||state.fullscreen===true;
    const backgroundFlag=s.kind==='background'||state.background===true;
    const kind=VALID_KINDS.has(s.kind)?s.kind:(boardFlag?'board':graphicFlag?'graphic':backgroundFlag?'background':'avatar');
    return {
      id:text(s.id)||nextId(),
      name:text(s.name,`Szene ${index+1}`)||`Szene ${index+1}`,
      duration:Math.max(.5,finite(s.duration,8)),
      kind,
      avatarMode:VALID_AVATAR.has(camera)?camera:'medium',
      speechText:text(s.speechText,s.transcript||state.transcript||''),
      gesture:VALID_GESTURES.has(s.gesture)?s.gesture:(s.avatarPoint||state.avatarPoint?'point':'front'),
      boardText:text(s.boardText,state.boardText||''),
      textObjects:normalizeTextObjects(s.textObjects||state.textObjects),
      mediumId:text(s.mediumId,''),
      mediumUrl:text(s.mediumUrl,state.object?.url||''),
      transition:VALID_TRANSITIONS.has(s.transition)?s.transition:'cut',
      presentationMedium:VALID_PRESENTATION_MEDIA.has(s.presentationMedium)?s.presentationMedium:'chalkboard',
      presentationVisible:s.presentationVisible!==false,
      mediumPosition:VALID_MEDIA_POSITIONS.has(s.mediumPosition)?s.mediumPosition:'right',
      mediumSize:VALID_MEDIA_SIZES.has(s.mediumSize)?s.mediumSize:'large',
      mediumEnter:VALID_MEDIA_EFFECTS.has(s.mediumEnter)?s.mediumEnter:'fade',
      mediumExit:VALID_MEDIA_EFFECTS.has(s.mediumExit)?s.mediumExit:'fade',
      effectDuration:Math.max(0,Math.min(2,finite(s.effectDuration,.6))),
      state:state&&Object.keys(state).length?{...state}:null
    };
  }

  function createPresentationModel(initialScenes){
    let scenes=(Array.isArray(initialScenes)?initialScenes:[]).map(normalizeScene);
    if(!scenes.length)scenes=[normalizeScene({name:'Szene 1',duration:8})];
    let activeSceneIndex=0;
    const api={
      getScenes(){captureEditorText(scenes,activeSceneIndex);return scenes.map(cloneScene);},
      get(i){
        if(!scenes[i])return null;
        captureEditorText(scenes,activeSceneIndex);activeSceneIndex=i;
        const result=cloneScene(scenes[i]);loadEditorText(result);
        const doc=activeDocument();
        if(doc){ensurePresentationUi(doc);writePresentationControls(result,doc);applyPresentationSurface(result,doc);}
        return result;
      },
      add(scene,index=scenes.length){
        captureEditorText(scenes,activeSceneIndex);
        const item=normalizeScene(scene,scenes.length);
        const at=Math.max(0,Math.min(scenes.length,finite(index,scenes.length)));
        scenes.splice(at,0,item);if(at<=activeSceneIndex)activeSceneIndex+=1;
        return cloneScene(item);
      },
      duplicate(index){
        if(!scenes[index])return null;captureEditorText(scenes,activeSceneIndex);
        const copy=normalizeScene({...scenes[index],textObjects:cloneTextObjects(scenes[index].textObjects),id:nextId(),name:`${scenes[index].name} · Kopie`},index+1);
        scenes.splice(index+1,0,copy);if(index+1<=activeSceneIndex)activeSceneIndex+=1;
        return cloneScene(copy);
      },
      remove(index){
        if(scenes.length<=1||!scenes[index])return false;captureEditorText(scenes,activeSceneIndex);
        const activeId=scenes[activeSceneIndex]?.id;scenes.splice(index,1);activeSceneIndex=Math.max(0,scenes.findIndex(scene=>scene.id===activeId));if(activeSceneIndex<0)activeSceneIndex=0;loadEditorText(scenes[activeSceneIndex]);return true;
      },
      move(index,delta){
        const target=index+delta;
        if(index<0||index>=scenes.length||target<0||target>=scenes.length)return false;captureEditorText(scenes,activeSceneIndex);
        const activeId=scenes[activeSceneIndex]?.id;const [item]=scenes.splice(index,1);scenes.splice(target,0,item);activeSceneIndex=scenes.findIndex(scene=>scene.id===activeId);return true;
      },
      update(index,patch){
        if(!scenes[index])return null;captureEditorText(scenes,activeSceneIndex);
        const doc=activeDocument();
        const presentationPatch=doc&&doc.getElementById('v1617PresentationControls')?readPresentationControls(doc):{};
        scenes[index]=normalizeScene({...scenes[index],...patch,...presentationPatch,id:scenes[index].id},index);
        if(index===activeSceneIndex)loadEditorText(scenes[index]);
        if(doc)applyPresentationSurface(scenes[index],doc);
        return cloneScene(scenes[index]);
      },
      replace(next){
        endSceneTextPreview();scenes=(Array.isArray(next)?next:[]).map(normalizeScene);
        if(!scenes.length)scenes=[normalizeScene({name:'Szene 1',duration:8})];activeSceneIndex=0;loadEditorText(scenes[0]);return scenes.map(cloneScene);
      },
      totalDuration:()=>scenes.reduce((sum,s)=>sum+s.duration,0)
    };
    return api;
  }

  function createPresentationRunner(inputScenes,handlers={}){
    let scenes=(Array.isArray(inputScenes)?inputScenes:[]).map(normalizeScene);
    let running=false,paused=false,stopped=false,sceneIndex=0,sceneTime=0,totalTime=0,entered=-1;
    const totalDuration=()=>scenes.reduce((sum,s)=>sum+s.duration,0);
    function enter(){
      if(sceneIndex<scenes.length&&entered!==sceneIndex){
        entered=sceneIndex;
        const current=cloneScene(scenes[sceneIndex]);beginSceneTextPreview(current);
        const doc=activeDocument();
        if(doc)applyPresentationSurface(current,doc);
        handlers.onSceneEnter?.(current,sceneIndex);
      }
    }
    function notify(){handlers.onTick?.(state());}
    function state(){
      return {
        running,paused,stopped,sceneIndex,sceneTime,totalTime,
        totalDuration:totalDuration(),
        progress:totalDuration()?Math.min(1,totalTime/totalDuration()):0,
        scene:scenes[sceneIndex]?cloneScene(scenes[sceneIndex]):null
      };
    }
    function start(){
      if(!scenes.length)return state();
      if(stopped&&totalTime>=totalDuration())reset();
      running=true;paused=false;stopped=false;enter();notify();return state();
    }
    function pause(){if(running){running=false;paused=true;}notify();return state();}
    function stop(){
      const doc=activeDocument();
      if(doc&&scenes[sceneIndex])hidePresentationSurface(scenes[sceneIndex],doc);
      running=false;paused=false;stopped=true;endSceneTextPreview();handlers.onStop?.(state());notify();return state();
    }
    function reset(){
      const doc=activeDocument();
      if(doc&&scenes[sceneIndex])hidePresentationSurface(scenes[sceneIndex],doc);
      running=false;paused=false;stopped=false;sceneIndex=0;sceneTime=0;totalTime=0;entered=-1;endSceneTextPreview();handlers.onReset?.();notify();return state();
    }
    function advance(seconds){
      if(!running||seconds<=0||sceneIndex>=scenes.length)return state();
      let remaining=Math.max(0,finite(seconds,0));
      while(remaining>0&&sceneIndex<scenes.length){
        enter();
        const left=Math.max(0,scenes[sceneIndex].duration-sceneTime);
        const step=Math.min(remaining,left);
        sceneTime+=step;totalTime+=step;remaining-=step;
        if(sceneTime>=scenes[sceneIndex].duration-1e-9){
          const doc=activeDocument();
          if(doc)hidePresentationSurface(scenes[sceneIndex],doc);
          handlers.onSceneComplete?.(cloneScene(scenes[sceneIndex]),sceneIndex);
          sceneIndex+=1;sceneTime=0;
          if(sceneIndex<scenes.length)enter();
          else{running=false;stopped=true;endSceneTextPreview();handlers.onComplete?.(state());break;}
        }
      }
      notify();return state();
    }
    return {start,pause,stop,reset,advance,getState:state,setScenes(next){scenes=(Array.isArray(next)?next:[]).map(normalizeScene);return reset();}};
  }

  function storyboardToScenes(storyboard){
    return (Array.isArray(storyboard)?storyboard:[]).map((item,i)=>normalizeScene({
      name:item?.name||`Szene ${i+1}`,
      duration:item?.duration,
      transition:item?.transition,
      state:item?.state||{},
      camera:item?.state?.camera,
      boardText:item?.state?.boardText,
      textObjects:item?.state?.textObjects,
      speechText:item?.state?.transcript,
      avatarPoint:item?.state?.avatarPoint
    },i));
  }

  function migrateProjectData(data){
    const src=data&&typeof data==='object'?data:{};
    let scenes=Array.isArray(src.presentationScenes)?src.presentationScenes:null;
    if(!scenes||!scenes.length)scenes=storyboardToScenes(src.storyboard);
    if(!scenes.length&&Array.isArray(src.states))scenes=src.states.map((state,i)=>normalizeScene({name:state?.name||`Szene ${i+1}`,state},i));
    if(!scenes.length)scenes=[normalizeScene({name:'Szene 1',duration:8})];
    return {...src,presentationScenes:scenes.map(normalizeScene)};
  }

  function formatTime(seconds){
    const s=Math.max(0,finite(seconds,0));
    const m=Math.floor(s/60);const r=s-m*60;
    return `${String(m).padStart(2,'0')}:${String(Math.floor(r)).padStart(2,'0')}.${Math.floor((r%1)*10)}`;
  }

  function presentationSurfaceMarkup(){
    return '<div id="presentationSurface" class="presentation-surface presentation-chalkboard" data-medium="chalkboard" data-position="right" data-size="large" data-enter="fade" aria-hidden="true"><div class="presentation-content"><div class="presentation-board-text"></div><img class="presentation-board-graphic" alt="" hidden></div></div>';
  }

  function presentationEditorMarkup(){
    return '<div id="v1617PresentationControls" class="v1617-presentation-controls">'+
      '<div class="v1617-title">Präsentationsmedium</div>'+
      '<label>Medium<select id="ftPresentationMedium"><option value="chalkboard">Schultafel</option><option value="flipchart">Flipchart</option><option value="whiteboard">Whiteboard</option><option value="custom">Benutzerdefiniert</option></select></label>'+
      '<div class="v1617-grid"><label>Position<select id="ftMediumPosition"><option value="left">Links</option><option value="center">Mitte</option><option value="right">Rechts</option></select></label><label>Größe<select id="ftMediumSize"><option value="small">Klein</option><option value="medium">Mittel</option><option value="large">Groß</option></select></label></div>'+
      '<label class="v1617-check"><input id="ftPresentationVisible" type="checkbox" checked> Medium sichtbar</label>'+
      '<div class="v1617-grid"><label>Einblend-Effekt<select id="ftMediumEnter"><option value="cut">Direkt</option><option value="fade">Einblenden</option><option value="slide-left">Hineinfahren von links</option><option value="slide-right">Hineinfahren von rechts</option><option value="slide-top">Hineinfahren von oben</option><option value="slide-bottom">Hineinfahren von unten</option></select></label><label>Ausblend-Effekt<select id="ftMediumExit"><option value="cut">Direkt</option><option value="fade">Einblenden</option><option value="slide-left">Herausfahren nach links</option><option value="slide-right">Herausfahren nach rechts</option><option value="slide-top">Herausfahren nach oben</option><option value="slide-bottom">Herausfahren nach unten</option></select></label></div>'+
      '<label>Effektdauer (Sek.)<input id="ftEffectDuration" type="number" min="0" max="2" step="0.1" value="0.6"></label>'+
      '<div class="v1617-hint">Rahmenlose Academy-Fläche; Tafel, Flipchart, Whiteboard oder eigenes Medium pro Szene austauschbar.</div>'+
      '</div>';
  }

  function presentationStyles(){
    return `
      .presentation-surface{position:absolute;z-index:3;opacity:0;pointer-events:none;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.22);will-change:transform,opacity;transition-property:transform,opacity;transition-timing-function:cubic-bezier(.2,.72,.24,1)}
      .presentation-surface[data-position="left"]{left:7%;right:auto}.presentation-surface[data-position="center"]{left:50%;right:auto;transform:translateX(-50%)}.presentation-surface[data-position="right"]{right:7%;left:auto}
      .presentation-surface[data-size="small"]{top:24%;width:34%;height:45%}.presentation-surface[data-size="medium"]{top:17%;width:50%;height:58%}.presentation-surface[data-size="large"]{top:10%;width:68%;height:70%}
      .presentation-surface.presentation-chalkboard{background-color:#252827;background-image:linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.08)),url('assets/tafel-academy.jpg');background-size:cover;background-position:center;border-radius:1px}
      .presentation-surface.presentation-whiteboard{background:linear-gradient(135deg,#f8fbfc,#e8eef1);box-shadow:0 18px 50px rgba(0,0,0,.22),inset 0 0 0 1px rgba(20,40,50,.16)}
      .presentation-surface.presentation-flipchart{width:min(35%,390px)!important;height:67%!important;top:10%!important;background:linear-gradient(#fff,#f1f1ed);border-radius:3px;box-shadow:0 18px 50px rgba(0,0,0,.22)}
      .presentation-surface.presentation-flipchart:after{content:"";position:absolute;left:48%;top:100%;width:4%;height:26%;background:#88939a;box-shadow:-80px 0 0 #88939a,80px 0 0 #88939a}
      .presentation-surface.presentation-custom{background:#14232d;border:1px solid rgba(255,255,255,.16)}
      .presentation-content{position:absolute;inset:0;padding:5.5%;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:4%;align-items:start}
      .presentation-board-text{position:relative;z-index:1;color:#f4f1e8;font-family:Georgia,serif;font-size:clamp(18px,1.4vw,34px);line-height:1.28;white-space:pre-wrap;text-shadow:0 1px 0 rgba(0,0,0,.35)}
      .presentation-board-graphic{position:relative;z-index:1;width:100%;max-height:82%;object-fit:contain;align-self:center;justify-self:center;filter:drop-shadow(0 10px 18px rgba(0,0,0,.22))}
      .presentation-board-graphic[hidden]{display:none}.presentation-content:has(.presentation-board-graphic[hidden]){grid-template-columns:1fr}
      .presentation-whiteboard .presentation-board-text,.presentation-flipchart .presentation-board-text{color:#18242b;font-family:Segoe UI,Arial,sans-serif;text-shadow:none}
      .presentation-surface.is-visible{opacity:1}
      .presentation-surface[data-enter="slide-left"]{transform:translateX(-115%)}.presentation-surface[data-enter="slide-right"]{transform:translateX(115%)}.presentation-surface[data-enter="slide-top"]{transform:translateY(-115%)}.presentation-surface[data-enter="slide-bottom"]{transform:translateY(115%)}
      .presentation-surface[data-position="center"][data-enter="slide-left"]{transform:translate(-165%,0)}.presentation-surface[data-position="center"][data-enter="slide-right"]{transform:translate(65%,0)}
      .presentation-surface.is-visible[data-enter="slide-left"],.presentation-surface.is-visible[data-enter="slide-right"],.presentation-surface.is-visible[data-enter="slide-top"],.presentation-surface.is-visible[data-enter="slide-bottom"]{transform:none}
      .presentation-surface.is-visible[data-position="center"]{transform:translateX(-50%)}
      .v1617-presentation-controls{margin-top:10px;padding-top:10px;border-top:1px solid #294556}.v1617-presentation-controls .v1617-title{font-weight:700;font-size:16px;margin-bottom:6px}.v1617-presentation-controls label{display:block;font-size:14px;margin:6px 0}.v1617-presentation-controls select,.v1617-presentation-controls input[type="number"]{width:100%;min-height:34px;background:#0b1a24;border:1px solid #234052;color:#eef6fb;border-radius:8px;padding:6px 8px;font-size:14px}.v1617-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v1617-check{display:flex!important;align-items:center;gap:8px}.v1617-check input{width:auto}.v1617-hint{font-size:12px;color:#8fa8b8;line-height:1.35;margin-top:6px}
    `;
  }

  function ensurePresentationUi(doc){
    if(!doc)return;
    const stage=doc.querySelector('.stage');
    if(stage&&!doc.getElementById('presentationSurface'))stage.insertAdjacentHTML('beforeend',presentationSurfaceMarkup());
    if(!doc.getElementById('v1617PresentationStyles')){
      const style=doc.createElement('style');
      style.id='v1617PresentationStyles';
      style.textContent=presentationStyles();
      doc.head.appendChild(style);
    }
    const drawer=doc.getElementById('freeTalkDrawer')||doc.getElementById('freeTalkEditor');
    if(drawer&&!doc.getElementById('v1617PresentationControls'))drawer.insertAdjacentHTML('beforeend',presentationEditorMarkup());
  }

  function writePresentationControls(scene,doc){
    if(!doc)return;
    const s=normalizeScene(scene||{});
    const set=(id,v)=>{const el=doc.getElementById(id);if(el)el.value=v;};
    set('ftPresentationMedium',s.presentationMedium);
    set('ftMediumPosition',s.mediumPosition);
    set('ftMediumSize',s.mediumSize);
    set('ftMediumEnter',s.mediumEnter);
    set('ftMediumExit',s.mediumExit);
    set('ftEffectDuration',s.effectDuration);
    const visible=doc.getElementById('ftPresentationVisible');if(visible)visible.checked=s.presentationVisible;
  }

  function readPresentationControls(doc){
    if(!doc)return {};
    const val=id=>doc.getElementById(id)?.value;
    return {
      presentationMedium:val('ftPresentationMedium')||'chalkboard',
      mediumPosition:val('ftMediumPosition')||'right',
      mediumSize:val('ftMediumSize')||'large',
      presentationVisible:doc.getElementById('ftPresentationVisible')?.checked!==false,
      mediumEnter:val('ftMediumEnter')||'fade',
      mediumExit:val('ftMediumExit')||'fade',
      effectDuration:finite(val('ftEffectDuration'),.6)
    };
  }

  function applyPresentationSurface(scene,doc){
    if(!doc)return;
    ensurePresentationUi(doc);
    const s=normalizeScene(scene||{});
    const surface=doc.getElementById('presentationSurface');
    if(!surface)return;
    surface.className=`presentation-surface presentation-${s.presentationMedium}`;
    surface.dataset.medium=s.presentationMedium;
    surface.dataset.position=s.mediumPosition;
    surface.dataset.size=s.mediumSize;
    surface.dataset.enter=s.mediumEnter;
    surface.dataset.exit=s.mediumExit;
    surface.style.transitionDuration=`${s.effectDuration}s`;
    const txt=surface.querySelector('.presentation-board-text');
    if(txt)txt.textContent=s.textObjects.length?'':(s.boardText||'');
    const graphic=surface.querySelector('.presentation-board-graphic');
    if(graphic){
      if(s.mediumUrl)graphic.src=s.mediumUrl;else graphic.removeAttribute('src');
      graphic.hidden=!s.mediumUrl;
    }
    if(s.presentationMedium==='custom'&&s.mediumUrl){
      surface.style.backgroundImage=`linear-gradient(rgba(0,0,0,.04),rgba(0,0,0,.04)),url('${s.mediumUrl.replace(/'/g,"%27")}')`;
      surface.style.backgroundSize='cover';surface.style.backgroundPosition='center';
    }else if(s.presentationMedium!=='chalkboard'){
      surface.style.backgroundImage='';surface.style.backgroundSize='';surface.style.backgroundPosition='';
    }
    const shouldShow=s.presentationVisible&&s.kind==='board';
    surface.setAttribute('aria-hidden',shouldShow?'false':'true');
    const toggle=()=>surface.classList.toggle('is-visible',shouldShow);
    if(typeof requestAnimationFrame==='function')requestAnimationFrame(toggle);else toggle();
  }

  function hidePresentationSurface(scene,doc){
    if(!doc)return;
    const s=normalizeScene(scene||{});
    const surface=doc.getElementById('presentationSurface');
    if(!surface)return;
    surface.dataset.enter=s.mediumExit;
    surface.style.transitionDuration=`${s.effectDuration}s`;
    surface.classList.remove('is-visible');
    surface.setAttribute('aria-hidden','true');
  }

  function installPresentationUi(doc){
    ensurePresentationUi(doc);
    if(!doc)return null;
    const observer=typeof MutationObserver==='function'?new MutationObserver(()=>ensurePresentationUi(doc)):null;
    observer?.observe(doc.documentElement,{childList:true,subtree:true});
    return observer;
  }

  if(typeof document!=='undefined'){
    const boot=()=>installPresentationUi(document);
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  }

  return {
    normalizeScene,createPresentationModel,createPresentationRunner,migrateProjectData,storyboardToScenes,formatTime,
    ensurePresentationUi,installPresentationUi,applyPresentationSurface,hidePresentationSurface,writePresentationControls,readPresentationControls,
    presentationSurfaceMarkup,presentationEditorMarkup,presentationStyles
  };
});
