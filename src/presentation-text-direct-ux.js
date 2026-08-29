(function(root){
'use strict';

function install(doc){
  const layer=doc?.getElementById?.('academyBoardObjectLayer');
  const editor=doc?.getElementById?.('academyBoardObjectEditor');
  if(!layer||!editor)return false;

  if(!doc.getElementById('academyDirectTextUxStyle')){
    const style=doc.createElement('style');
    style.id='academyDirectTextUxStyle';
    style.textContent='.academy-board-content-field,.academy-board-quick-actions{display:none!important}.academy-board-object-text{pointer-events:auto}.academy-board-object-text span{pointer-events:none}.academy-board-object-text span[contenteditable="true"]{pointer-events:auto;cursor:text;user-select:text;white-space:pre-wrap;outline:none}.academy-board-object-delete{position:absolute;right:-13px;top:-13px;width:24px;height:24px;border:0;border-radius:50%;display:grid;place-items:center;background:#b92f3b;color:#fff;font:700 14px/1 Arial,sans-serif;cursor:pointer;z-index:8;box-shadow:0 2px 7px rgba(0,0,0,.35)}';
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

  const persistText=(node,text)=>{
    const id=node?.dataset?.objectId;
    if(!id)return;
    layer.dataset.activeTextId=id;
    const row=editor.querySelector?.(`[data-list-id="${CSS.escape(id)}"]`);
    row?.click?.();
    const input=editor.querySelector?.('[data-prop="content"]');
    if(input){
      input.value=text;
      input.dispatchEvent(new Event('input',{bubbles:true}));
    }
  };

  layer.addEventListener('pointerdown',event=>{
    if(event.target?.isContentEditable){
      event.stopImmediatePropagation();
      return;
    }
    const node=event.target?.closest?.('.academy-board-object-text[data-object-id]');
    if(node&&!event.target?.closest?.('[data-resize-handle]')&&!event.target?.closest?.('[data-direct-delete]'))activate(node);
  },true);

  layer.addEventListener('dblclick',event=>{
    const node=event.target?.closest?.('.academy-board-object-text[data-object-id]');
    if(!node)return;
    const text=node.querySelector?.('span');
    if(!text)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    activate(node);
    node.dataset.editing='1';
    node.querySelector?.('[data-direct-delete]')?.remove?.();
    text.contentEditable='true';
    text.focus?.();
    const selection=root.getSelection?.();
    if(selection&&doc.createRange){
      const range=doc.createRange();
      range.selectNodeContents(text);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    const finish=()=>{
      const value=text.textContent||'';
      text.contentEditable='false';
      delete node.dataset.editing;
      persistText(node,value);
      setTimeout(decorate,0);
    };
    text.addEventListener('blur',finish,{once:true});
  },true);

  layer.addEventListener('click',event=>{
    const button=event.target?.closest?.('[data-direct-delete]');
    if(!button)return;
    const node=button.closest?.('[data-object-id]');
    const id=node?.dataset?.objectId;
    if(!id)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const row=editor.querySelector?.(`[data-list-id="${CSS.escape(id)}"]`);
    row?.click?.();
    editor.querySelector?.('[data-board-delete]')?.click?.();
    delete layer.dataset.activeTextId;
    setTimeout(decorate,0);
  },true);

  const observer=new MutationObserver(()=>setTimeout(decorate,0));
  observer.observe(layer,{childList:true,subtree:true});
  decorate();
  return true;
}

root.AcademyPresentationTextDirectUx={install,activate:(doc,node)=>{
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
