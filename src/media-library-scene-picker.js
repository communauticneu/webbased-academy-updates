(function(){
  'use strict';

  const $=id=>document.getElementById(id);
  let select=null,urlInput=null;

  function sceneIndex(){
    const active=document.querySelector('#sceneList .scene.active[data-fp-index]');
    return active?Number(active.dataset.fpIndex)||0:0;
  }

  function currentScene(){
    const scenes=window.__freePresentationScenes?.();
    return Array.isArray(scenes)?(scenes[sceneIndex()]||scenes[0]||null):null;
  }

  function mediaName(item,index){
    return item.querySelector('.name')?.textContent?.trim()||`Medium ${index+1}`;
  }

  function ensureMediaId(item,index){
    if(item.dataset.mediaId)return item.dataset.mediaId;
    const kind=item.dataset.kind||'media';
    const name=mediaName(item,index);
    item.dataset.mediaId=`library:${kind}:${encodeURIComponent(name)}:${index}`;
    return item.dataset.mediaId;
  }

  function savedName(id){
    if(!id)return 'Gespeichertes Medium';
    const parts=String(id).split(':');
    if(parts[0]==='import'&&parts[1]){
      try{return decodeURIComponent(parts[1])}catch{}
    }
    return 'Gespeichertes Medium';
  }

  function refreshMediaOptions(scene=currentScene()){
    if(!select)return;
    const wanted=scene?.mediumId||select.value||'';
    select.innerHTML='';
    const none=document.createElement('option');none.value='';none.textContent='Kein Medium';select.appendChild(none);
    document.querySelectorAll('#mediaGrid .media-item').forEach((item,index)=>{
      const option=document.createElement('option');
      option.value=ensureMediaId(item,index);
      option.textContent=mediaName(item,index);
      option.dataset.url=item.dataset.url||'';
      option.dataset.kind=item.dataset.kind||'';
      select.appendChild(option);
    });
    if(wanted&&![...select.options].some(option=>option.value===wanted)){
      const option=document.createElement('option');
      option.value=wanted;
      option.textContent=`Gespeichertes Medium · ${savedName(wanted)}`;
      option.dataset.url=scene?.mediumUrl||'';
      option.dataset.kind='saved';
      select.appendChild(option);
    }
    select.value=wanted;
    syncSelectedMedium();
  }

  function syncSelectedMedium(){
    if(!select||!urlInput)return;
    const option=select.options[select.selectedIndex];
    urlInput.value=option?.dataset.url||'';
  }

  function replaceMediumInputs(){
    const old=$('fpMedium');urlInput=$('fpMediumUrl');
    if(!old||!urlInput)return false;
    select=document.createElement('select');select.id='fpMedium';select.className=old.className||'';
    const label=old.closest('label');
    if(label&&label.firstChild?.nodeType===Node.TEXT_NODE)label.firstChild.nodeValue='Medium/Grafik aus Medienbibliothek';
    old.replaceWith(select);
    urlInput.type='hidden';
    const urlLabel=urlInput.closest('label');if(urlLabel)urlLabel.style.display='none';
    select.addEventListener('change',syncSelectedMedium);
    return true;
  }

  function durableId(file){
    return `import:${encodeURIComponent(file.name||'Medium')}:${Number(file.size)||0}:${Number(file.lastModified)||0}`;
  }

  function addDurableImage(file){
    if(!file||!String(file.type||'').startsWith('image/'))return;
    const reader=new FileReader();
    reader.onload=()=>{
      const dataUrl=String(reader.result||'');if(!dataUrl)return;
      const grid=$('mediaGrid');if(!grid)return;
      const id=durableId(file);
      let item=[...grid.querySelectorAll('.media-item')].find(node=>node.dataset.mediaId===id);
      if(!item){item=document.createElement('div');item.className='media-item';item.draggable=true;grid.appendChild(item)}
      item.dataset.kind='image';item.dataset.mediaId=id;item.dataset.url=dataUrl;
      item.innerHTML='<div class="thumb"></div><div class="name"></div>';
      const thumb=item.querySelector('.thumb');thumb.style.backgroundImage=`url(${dataUrl})`;thumb.style.backgroundSize='cover';thumb.style.backgroundPosition='center';
      item.querySelector('.name').textContent=file.name;
      item.addEventListener('dragstart',event=>event.dataTransfer?.setData('text/plain','image'));
      refreshMediaOptions(currentScene());
    };
    reader.readAsDataURL(file);
  }

  function interceptImports(){
    const input=$('mediaInput'),drop=$('dropzone');
    input?.addEventListener('change',event=>{
      event.stopImmediatePropagation();
      [...(event.target.files||[])].forEach(addDurableImage);
      event.target.value='';
    },true);
    drop?.addEventListener('drop',event=>{
      event.preventDefault();event.stopImmediatePropagation();
      [...(event.dataTransfer?.files||[])].forEach(addDurableImage);
      drop.classList.remove('drag');
    },true);
  }

  function bindEditor(){
    $('freeTalkEditor')?.addEventListener('click',()=>setTimeout(()=>refreshMediaOptions(currentScene()),0),true);
    $('sceneList')?.addEventListener('click',event=>{
      if(event.target.closest('.scene'))setTimeout(()=>refreshMediaOptions(currentScene()),0);
    },true);
    $('fpApply')?.addEventListener('click',syncSelectedMedium,true);
  }

  function boot(){
    if(!replaceMediumInputs())return;
    interceptImports();bindEditor();refreshMediaOptions(currentScene());
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});
  else setTimeout(boot,0);
})();
