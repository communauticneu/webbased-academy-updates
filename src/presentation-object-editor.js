(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.AcademyPresentationObjectEditor=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const DRAFTS={
    text:{type:'text',content:'Neuer Kreidetext',x:12,y:12,width:42,height:14,rotation:0,enter:'write',exit:'wipe'},
    postit:{type:'postit',content:'Neuer Hinweis',x:12,y:28,width:30,height:14,rotation:0,enter:'unroll',exit:'wipe'},
    graphic:{type:'graphic',content:'',x:48,y:18,width:38,height:38,rotation:0,enter:'fade',exit:'wipe'},
    arrow:{type:'arrow',content:'',x:18,y:48,width:30,height:12,rotation:0,enter:'draw',exit:'wipe'},
    circle:{type:'circle',content:'',x:50,y:44,width:24,height:18,rotation:0,enter:'draw',exit:'wipe'},
    line:{type:'line',content:'',x:18,y:66,width:34,height:4,rotation:0,enter:'draw',exit:'wipe'}
  };

  function createObjectDraft(type){
    const source=DRAFTS[type]||DRAFTS.text;
    return {...source};
  }

  function editorMarkup(){
    return '<section id="academyBoardObjectEditor" class="academy-board-object-editor" aria-label="Tafelinhalte">'+
      '<div class="academy-board-editor-head"><strong>Tafelinhalte</strong><span>Element wählen und direkt auf der Tafel platzieren</span></div>'+
      '<div id="academyBoardObjectToolbar" class="academy-board-object-toolbar">'+
        '<button type="button" data-board-object="text">✎ Kreidetext</button>'+
        '<button type="button" data-board-object="postit">▰ Post-it</button>'+
        '<button type="button" data-board-object="graphic">▧ Grafik</button>'+
        '<button type="button" data-board-object="arrow">➜ Pfeil</button>'+
        '<button type="button" data-board-object="circle">◯ Kreis</button>'+
        '<button type="button" data-board-object="line">╱ Linie</button>'+
      '</div>'+
      '<div id="academyBoardObjectList" class="academy-board-object-list" aria-live="polite"></div>'+
    '</section>';
  }

  function editorStyles(){
    return '.academy-board-object-editor{display:grid;gap:10px;padding:12px;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:rgba(10,18,24,.48)}'+
      '.academy-board-editor-head{display:flex;justify-content:space-between;gap:12px;align-items:baseline}.academy-board-editor-head span{font-size:12px;opacity:.72}'+
      '.academy-board-object-toolbar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.academy-board-object-toolbar button{min-height:38px;border:1px solid rgba(255,255,255,.14);border-radius:8px;background:rgba(255,255,255,.06);color:inherit;cursor:pointer}'+
      '.academy-board-object-toolbar button:hover{background:rgba(255,255,255,.11)}.academy-board-object-list{display:grid;gap:6px;max-height:150px;overflow:auto}';
  }

  function install(doc,onCreate){
    if(!doc)return false;
    const host=doc.querySelector('.v1623-edit-content')?.parentElement;
    if(!host)return false;
    let editor=doc.getElementById('academyBoardObjectEditor');
    if(!editor){
      const wrap=doc.createElement('div');
      wrap.innerHTML=editorMarkup();
      editor=wrap.firstElementChild;
      host.appendChild(editor);
    }
    if(!doc.getElementById('academyBoardObjectEditorStyle')){
      const style=doc.createElement('style');
      style.id='academyBoardObjectEditorStyle';
      style.textContent=editorStyles();
      doc.head?.appendChild(style);
    }
    editor.querySelectorAll('[data-board-object]').forEach(button=>{
      if(button.dataset.bound==='1')return;
      button.dataset.bound='1';
      button.addEventListener('click',()=>onCreate?.(createObjectDraft(button.dataset.boardObject)));
    });
    return true;
  }

  return {createObjectDraft,editorMarkup,editorStyles,install};
});
