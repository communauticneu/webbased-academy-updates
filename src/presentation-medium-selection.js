(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.AcademyPresentationMediumSelection=api;
  if(root&&root.document){
    const boot=()=>api.install(root.document,root.AcademyPresentationStage);
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});
    else boot();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function clearLegacySurfaceContent(doc){
    const surface=doc?.getElementById?.('presentationSurface');
    if(!surface)return false;
    const text=surface.querySelector?.('.presentation-board-text');
    const graphic=surface.querySelector?.('.presentation-board-graphic');
    if(text)text.textContent='';
    if(graphic){
      graphic.hidden=true;
      graphic.removeAttribute?.('src');
      if('src' in graphic)graphic.src='';
    }
    return true;
  }

  function bindPresentationMediumSelection(doc,stageApi){
    if(!doc||!stageApi||typeof stageApi.setAcademyBoardVisible!=='function')return false;
    const buttons=Array.from(doc.querySelectorAll?.('[data-presentation-medium]')||[]);
    if(!buttons.length)return false;
    buttons.forEach(button=>{
      if(button.dataset.mediumSelectionBound==='1')return;
      button.dataset.mediumSelectionBound='1';
      button.addEventListener('click',()=>{
        const wasActive=button.classList?.contains?.('active');
        if(button.dataset.presentationMedium==='chalkboard'&&wasActive){
          buttons.forEach(item=>item.classList?.remove?.('active'));
          stageApi.setAcademyBoardVisible(doc,false);
          return;
        }
        buttons.forEach(item=>item.classList?.toggle?.('active',item===button));
        if(button.dataset.presentationMedium==='chalkboard'){
          stageApi.setAcademyBoardVisible(doc,true);
          clearLegacySurfaceContent(doc);
        }
      });
    });
    return true;
  }

  function prepareButtons(doc){
    const buttons=Array.from(doc?.querySelectorAll?.('.v1623-medium-grid button')||[]);
    const media=[
      {id:'chalkboard',label:'Tafel'},
      {id:'whiteboard',label:'Whiteboard'},
      {id:'pinwall',label:'Pinwall'}
    ];
    buttons.forEach((button,index)=>{
      const medium=media[index];
      button.classList?.remove?.('active');
      if(medium){
        button.hidden=false;
        button.textContent=medium.label;
        button.dataset.presentationMedium=medium.id;
      }else{
        button.hidden=true;
        delete button.dataset.presentationMedium;
      }
    });
    return buttons.length>0;
  }

  function install(doc,stageApi){
    if(!doc)return false;
    const bind=()=>{prepareButtons(doc);return bindPresentationMediumSelection(doc,stageApi);};
    if(bind())return true;
    setTimeout(bind,0);
    setTimeout(bind,1200);
    return true;
  }

  return {bindPresentationMediumSelection,prepareButtons,clearLegacySurfaceContent,install};
});
