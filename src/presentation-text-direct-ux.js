(function(root){
'use strict';

function isEditingGesture(event){
  return !!event?.target?.closest?.('.academy-board-object-text[data-object-id]') && Number(event.detail)>=2;
}

function install(doc){
  const layer=doc?.getElementById?.('academyBoardObjectLayer');
  const editor=doc?.getElementById?.('academyBoardObjectEditor');
  if(!layer||!editor)return false;
  editor.querySelector?.('[data-text-kind-menu]')?.classList?.add('academy-submenu');

  if(!doc.getElementById('academyDirectTextUxStyle')){
    const style=doc.createElement('style');
    style.id='academyDirectTextUxStyle';
    style.textContent='.academy-board-content-field,.academy-board-quick-actions{display:none!important}.academy-board-editor-head span{display:none!important}.academy-board-object-list{display:none!important;overflow:hidden!important;max-width:100%!important;min-width:0!important}.academy-board-object-row{min-width:0!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}.academy-submenu,.academy-text-kind-menu{position:relative;margin-left:10px!important;margin-right:10px!important;padding:20px 6px 6px!important;border:1px solid rgba(76,200,255,.42)!important;border-radius:8px!important;background:rgba(76,200,255,.12)!important;box-shadow:0 4px 14px rgba(0,0,0,.16)!important}.academy-text-kind-menu::before{content:"Textart";position:absolute;left:8px;top:4px;font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;opacity:.78;pointer-events:none}.academy-text-kind-menu button{min-height:24px!important;padding:2px 5px!important;font-size:10px!important;background:rgba(3,18,28,.38)!important}.academy-text-kind-menu button:hover{background:rgba(76,200,255,.18)!important}.academy-board-object-layer{overflow:hidden!important}.academy-room-avatar{pointer-events:none!important}.stage>.avatar,.stage .avatar{pointer-events:none!important}.academy-board-object-text{pointer-events:auto;height:auto!important;min-height:2.2em!important;align-items:flex-start!important;overflow:visible!important;padding:3px 4px!important}.academy-board-object-text.academy-text-heading{min-height:2.4em!important}.academy-board-object-text.academy-text-normal{min-height:2.15em!important}.academy-board-object-text.academy-text-small{min-height:2em!important}.academy-board-object-text.selected{z-index:50!important;pointer-events:auto}.academy-board-object-text span{pointer-events:auto;display:block;width:100%;min-height:1.2em}.academy-board-object-text span[contenteditable="true"]{pointer-events:auto;cursor:text;user-select:text;white-space:pre-wrap;outline:none}.academy-board-object-delete{position:absolute;right:-13px;top:-13px;width:24px;height:24px;border:0;border-radius:50%;display:grid;place-items:center;background:#b92f3b;color:#fff;font:700 14px/1 Arial,sans-serif;cursor:pointer;pointer-events:auto;z-index:80;box-shadow:0 2px 7px rgba(0,0,0,.35)}';
    doc.head?.appendChild(style);
  }

  const restoreActiveSelection=()=>{
    const id=layer.dataset.activeTextId;
    if(!id)return null;
    let selected=null;
    layer.querySelectorAll?.('.academy-board-object-text[data-object-id]')?.forEach?.(item=>{
      const active=item.dataset.objectId===id;
      item.classList.toggle('selected',active);
      if(active)selected=item;
    });
    if(!selected)delete layer.dataset.activeTextId;
    return selected;
  };

  const decorate=()=>{
    const selected=restoreActiveSelection()||layer.querySelector?.('.academy-board-object-text.selected');
    const existing=layer.querySelector?.('.academy-board-object-delete');
    if(!selected||selected.dataset.editing==='1'){
      existing?.remove?.();
      return;
    }
    if(existing?.parentElement===selected)return;
    const button=existing||doc.createElement('button');
    if(!existing){
      button.type='button';
      button.className='academy-board-object-delete';
      button.dataset.directDelete='1';
      button.setAttribute('aria-label','Text löschen');
      button.title='Text löschen';
      button.textContent='🗑';
    }
    selected.appendChild(button);
  };

  const activate=node=>{
    if(!node?.dataset?.objectId)return false;
    layer.dataset.activeTextId=node.dataset.objectId;
    layer.querySelectorAll?.('[data-object-id]')?.forEach?.(item=>item.classList.toggle('selected',item===node));
    decorate();
    return true;
  };

  layer.addEventListener('pointerdown',event=>{
    if(event.target?.isContentEditable){event.stopImmediatePropagation();return;}
    if(event.target?.closest?.('[data-direct-delete]')){event.stopPropagation();event.stopImmediatePropagation();return;}
    const node=event.target?.closest?.('.academy-board-object-text[data-object-id]');
    if(node&&!event.target?.closest?.('[data-resize-handle]'))activate(node);
  },true);

  layer.addEventListener('dblclick',event=>{
    const node=event.target?.closest?.('.academy-board-object-text[data-object-id]');
    if(!node)return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();activate(node);
    node.querySelector?.('[data-direct-delete]')?.remove?.();
    root.AcademyPresentationObjectEditor?.beginDirectTextEdit?.(doc,node);
  },true);

  layer.addEventListener('click',event=>{
    const button=event.target?.closest?.('[data-direct-delete]');
    if(!button)return;
    const node=button.closest?.('[data-object-id]');
    const id=node?.dataset?.objectId;
    if(!id)return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    root.AcademyPresentationObjectEditor?.selectWithoutRender?.(doc,id,node);
    const deleted=root.AcademyPresentationObjectEditor?.deleteSelected?.(doc);
    if(deleted)delete layer.dataset.activeTextId;
    setTimeout(decorate,0);
  },true);

  const observer=new MutationObserver(()=>setTimeout(decorate,0));
  observer.observe(layer,{childList:true,subtree:true});
  decorate();
  return true;
}

root.AcademyPresentationTextDirectUx={install,isEditingGesture,activate:(doc,node)=>{
  const layer=doc?.getElementById?.('academyBoardObjectLayer');
  if(!layer||!node?.dataset?.objectId)return false;
  layer.dataset.activeTextId=node.dataset.objectId;
  layer.querySelectorAll?.('[data-object-id]')?.forEach?.(item=>item.classList.toggle('selected',item===node));
  return true;
}};
if(root.document){
  const boot=()=>install(root.document)||setTimeout(()=>install(root.document),60);
  if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
}
})(typeof globalThis!=='undefined'?globalThis:this);
