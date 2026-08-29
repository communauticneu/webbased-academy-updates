(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.AcademyPresentationObjectAnimation=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
function stateAt(object,time){
  const timing=object?.timing||{},animation=object?.animation||{};
  const now=Math.max(0,Number(time)||0),start=Math.max(0,Number(timing.start)||0),enterDuration=Math.max(0,Number(timing.enterDuration)||0),end=Math.max(start,Number(timing.end)||start),exitDuration=Math.max(0,Number(timing.exitDuration)||0);
  const enter=animation.enter||'fade',exit=animation.exit||'fade';
  if(now<start)return {phase:'hidden',progress:0,effect:enter};
  if(enterDuration>0&&now<start+enterDuration)return {phase:'enter',progress:clamp((now-start)/enterDuration),effect:enter};
  if(now<end||exitDuration===0&&now===end)return {phase:'visible',progress:1,effect:'none'};
  if(exitDuration>0&&now<end+exitDuration)return {phase:'exit',progress:clamp((now-end)/exitDuration),effect:exit};
  return {phase:'hidden',progress:1,effect:exit};
}
function attributesFor(object,time){const s=stateAt(object,time);return `data-animation-phase="${s.phase}" data-animation-effect="${s.effect}" style="--academy-animation-progress:${s.progress}"`;}
return {stateAt,attributesFor};
});