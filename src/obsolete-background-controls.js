(function(root){
  'use strict';

  function removeObsoleteBackgroundControls(doc){
    if(!doc)return false;
    const grid=doc.querySelector?.('.v1623-background-grid');
    const section=grid?.closest?.('.v1623-section');
    if(!section)return false;
    section.remove();
    return true;
  }

  function install(doc){
    if(!doc)return false;
    const remove=()=>removeObsoleteBackgroundControls(doc);
    if(remove())return true;
    root?.setTimeout?.(remove,0);
    root?.setTimeout?.(remove,250);
    root?.setTimeout?.(remove,1200);
    return true;
  }

  const api={removeObsoleteBackgroundControls,install};
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.AcademyObsoleteBackgroundControls=api;
  if(root&&root.document){
    const boot=()=>install(root.document);
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});
    else boot();
  }
})(typeof globalThis!=='undefined'?globalThis:this);
