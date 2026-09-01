(function(root){
'use strict';
const RESET_KEY='wac_text_reset_01645';
const PROJECT_KEY='wac_v15_last_project';
function clearScenes(list){
 if(!Array.isArray(list))return;
 list.forEach(scene=>{
  if(!scene||typeof scene!=='object')return;
  scene.textObjects=[];
  if(scene.state&&typeof scene.state==='object')scene.state.textObjects=[];
 });
}
function clearFaultyAutosavedText(){
 try{
  if(root.localStorage?.getItem(RESET_KEY)==='1')return false;
  const raw=root.localStorage?.getItem(PROJECT_KEY);
  if(raw){
   const data=JSON.parse(raw);
   clearScenes(data.presentationScenes);
   if(Array.isArray(data.storyboard))data.storyboard.forEach(item=>{if(item?.state&&typeof item.state==='object')item.state.textObjects=[];});
   if(Array.isArray(data.states))data.states.forEach(state=>{if(state&&typeof state==='object')state.textObjects=[];});
   if(data.current&&typeof data.current==='object')data.current.textObjects=[];
   root.localStorage.setItem(PROJECT_KEY,JSON.stringify(data));
  }
  root.localStorage.setItem(RESET_KEY,'1');
  return true;
 }catch(_error){return false;}
}
clearFaultyAutosavedText();
root.AcademyTextStartupReset={clearFaultyAutosavedText};
})(typeof globalThis!=='undefined'?globalThis:this);
