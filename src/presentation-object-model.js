(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.AcademyPresentationObjects=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const TYPES=new Set(['text','graphic','postit','arrow','circle','line','frame']);
  const ENTERS=new Set(['instant','fade','write','draw','unroll']);
  const EXITS=new Set(['instant','fade','wipe']);
  const OPTIONS=new Set(['chalkboard','whiteboard','pinwall','3d']);
  const STAGE_MODES=new Set(['room','emphasized','fullscreen']);
  const DEPTHS=new Set(['behind-avatar','stage','front-avatar']);
  let idCounter=0;

  const finite=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,finite(value,min)));
  const string=(value,fallback='')=>typeof value==='string'?value:fallback;
  const id=()=>`display-object-${Date.now().toString(36)}-${(++idCounter).toString(36)}`;

  function normalizePresentationObject(input={}){
    const source=input&&typeof input==='object'?input:{};
    const start=Math.max(0,finite(source.start,0));
    const end=Math.max(start,finite(source.end,start));
    return {
      id:string(source.id)||id(),
      type:TYPES.has(source.type)?source.type:'text',
      content:string(source.content),
      assetId:string(source.assetId),
      assetUrl:string(source.assetUrl),
      frame:{
        x:clamp(source.x,0,100),
        y:clamp(source.y,0,100),
        width:clamp(source.width,1,100),
        height:clamp(source.height,1,100),
        rotation:finite(source.rotation,0)
      },
      timing:{
        start,
        enterDuration:Math.max(0,finite(source.enterDuration,.6)),
        end,
        exitDuration:Math.max(0,finite(source.exitDuration,.6))
      },
      animation:{
        enter:ENTERS.has(source.enter)?source.enter:'fade',
        exit:EXITS.has(source.exit)?source.exit:'fade'
      }
    };
  }

  function normalizeDisplay(input={}){
    const source=input&&typeof input==='object'?input:{};
    return {
      option:OPTIONS.has(source.option)?source.option:'chalkboard',
      stageMode:STAGE_MODES.has(source.stageMode)?source.stageMode:'room',
      avatarVisible:source.avatarVisible!==false,
      depth:DEPTHS.has(source.depth)?source.depth:'stage',
      objects:(Array.isArray(source.objects)?source.objects:[]).map(normalizePresentationObject)
    };
  }

  return {normalizePresentationObject,normalizeDisplay};
});
