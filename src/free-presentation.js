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
  let idCounter=0;

  const finite=(v,f)=>Number.isFinite(Number(v))?Number(v):f;
  const text=(v,f='')=>typeof v==='string'?v:f;
  const nextId=()=>`scene-${Date.now().toString(36)}-${(++idCounter).toString(36)}`;

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
      mediumId:text(s.mediumId,''),
      mediumUrl:text(s.mediumUrl,state.object?.url||''),
      transition:VALID_TRANSITIONS.has(s.transition)?s.transition:'cut',
      state:state&&Object.keys(state).length?{...state}:null
    };
  }

  function createPresentationModel(initialScenes){
    let scenes=(Array.isArray(initialScenes)?initialScenes:[]).map(normalizeScene);
    if(!scenes.length)scenes=[normalizeScene({name:'Szene 1',duration:8})];
    const api={
      getScenes:()=>scenes.map(s=>({...s,state:s.state?{...s.state}:null})),
      get:(i)=>scenes[i]?{...scenes[i],state:scenes[i].state?{...scenes[i].state}:null}:null,
      add(scene,index=scenes.length){
        const item=normalizeScene(scene,scenes.length);
        const at=Math.max(0,Math.min(scenes.length,finite(index,scenes.length)));
        scenes.splice(at,0,item);return {...item};
      },
      duplicate(index){
        if(!scenes[index])return null;
        const copy=normalizeScene({...scenes[index],id:nextId(),name:`${scenes[index].name} · Kopie`},index+1);
        scenes.splice(index+1,0,copy);return {...copy};
      },
      remove(index){
        if(scenes.length<=1||!scenes[index])return false;
        scenes.splice(index,1);return true;
      },
      move(index,delta){
        const target=index+delta;
        if(index<0||index>=scenes.length||target<0||target>=scenes.length)return false;
        const [item]=scenes.splice(index,1);scenes.splice(target,0,item);return true;
      },
      update(index,patch){
        if(!scenes[index])return null;
        scenes[index]=normalizeScene({...scenes[index],...patch,id:scenes[index].id},index);
        return {...scenes[index]};
      },
      replace(next){
        scenes=(Array.isArray(next)?next:[]).map(normalizeScene);
        if(!scenes.length)scenes=[normalizeScene({name:'Szene 1',duration:8})];
        return api.getScenes();
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
      if(sceneIndex<scenes.length&&entered!==sceneIndex){entered=sceneIndex;handlers.onSceneEnter?.({...scenes[sceneIndex]},sceneIndex);}
    }
    function notify(){handlers.onTick?.(state());}
    function state(){return {running,paused,stopped,sceneIndex,sceneTime,totalTime,totalDuration:totalDuration(),progress:totalDuration()?Math.min(1,totalTime/totalDuration()):0,scene:scenes[sceneIndex]?{...scenes[sceneIndex]}:null};}
    function start(){
      if(!scenes.length)return state();
      if(stopped&&totalTime>=totalDuration())reset();
      running=true;paused=false;stopped=false;enter();notify();return state();
    }
    function pause(){if(running){running=false;paused=true;}notify();return state();}
    function stop(){running=false;paused=false;stopped=true;handlers.onStop?.(state());notify();return state();}
    function reset(){running=false;paused=false;stopped=false;sceneIndex=0;sceneTime=0;totalTime=0;entered=-1;handlers.onReset?.();notify();return state();}
    function advance(seconds){
      if(!running||seconds<=0||sceneIndex>=scenes.length)return state();
      let remaining=Math.max(0,finite(seconds,0));
      while(remaining>0&&sceneIndex<scenes.length){
        enter();
        const left=Math.max(0,scenes[sceneIndex].duration-sceneTime);
        const step=Math.min(remaining,left);
        sceneTime+=step;totalTime+=step;remaining-=step;
        if(sceneTime>=scenes[sceneIndex].duration-1e-9){
          handlers.onSceneComplete?.({...scenes[sceneIndex]},sceneIndex);
          sceneIndex+=1;sceneTime=0;
          if(sceneIndex<scenes.length){enter();}
          else{running=false;stopped=true;handlers.onComplete?.(state());break;}
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

  return {normalizeScene,createPresentationModel,createPresentationRunner,migrateProjectData,storyboardToScenes,formatTime};
});
