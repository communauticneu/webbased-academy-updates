(function(root){
'use strict';
function install(doc){
  const surface=doc?.getElementById?.('presentationSurface');
  const layer=doc?.getElementById?.('academyBoardObjectLayer');
  const stage=surface?.parentElement;
  if(!surface||!layer||!stage)return false;

  if(layer.parentElement!==stage)stage.appendChild(layer);

  if(!doc.getElementById('academyNeutralObjectLayerStyle')){
    const style=doc.createElement('style');
    style.id='academyNeutralObjectLayerStyle';
    style.textContent='.stage:has(.presentation-surface.presentation-chalkboard.is-visible) .academy-board-object-text{color:#f3f0df;font-family:"DJB Chalk It Up","Segoe Print","Comic Sans MS",cursive;text-shadow:0 0 1px rgba(255,255,255,.9),0 0 3px rgba(255,255,255,.22);filter:contrast(1.03)}';
    doc.head?.appendChild(style);
  }

  if(layer.dataset.stableDragBound==='1')return true;
  layer.dataset.stableDragBound='1';
  let drag=null;

  layer.addEventListener('pointerdown',event=>{
    if(event.target?.isContentEditable)return;
    if(event.target?.closest?.('[data-direct-delete]'))return;
    if(root.AcademyPresentationTextDirectUx?.isEditingGesture?.(event))return;
    const node=event.target?.closest?.('[data-object-id]');
    if(!node)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if(node.classList?.contains?.('academy-board-object-text'))root.AcademyPresentationTextDirectUx?.activate?.(doc,node);
    else root.AcademyPresentationObjectEditor?.selectWithoutRender?.(doc,node.dataset.objectId,node);
    const rect=layer.getBoundingClientRect();
    const isResize=!!event.target.closest?.('[data-resize-handle]');
    drag={node,startX:event.clientX,startY:event.clientY,left:parseFloat(node.style.left)||0,top:parseFloat(node.style.top)||0,width:parseFloat(node.style.width)||20,height:parseFloat(node.style.height)||10,isResize,rect};
    node.setPointerCapture?.(event.pointerId);
  },true);

  layer.addEventListener('pointermove',event=>{
    if(!drag)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const dx=drag.rect.width?(event.clientX-drag.startX)/drag.rect.width*100:0;
    const dy=drag.rect.height?(event.clientY-drag.startY)/drag.rect.height*100:0;
    if(drag.isResize){
      drag.node.style.width=`${Math.max(4,Math.min(100-drag.left,drag.width+dx))}%`;
      drag.node.style.height=`${Math.max(4,Math.min(100-drag.top,drag.height+dy))}%`;
    }else{
      drag.node.style.left=`${Math.max(0,Math.min(100-drag.width,drag.left+dx))}%`;
      drag.node.style.top=`${Math.max(0,Math.min(100-drag.height,drag.top+dy))}%`;
    }
  },true);

  const finish=event=>{
    if(!drag)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const values=drag.isResize?{width:parseFloat(drag.node.style.width),height:parseFloat(drag.node.style.height)}:{x:parseFloat(drag.node.style.left),y:parseFloat(drag.node.style.top)};
    const editor=doc.getElementById('academyBoardObjectEditor');
    for(const [key,value] of Object.entries(values)){
      const input=editor?.querySelector?.(`[data-prop="${key}"]`);
      if(input){input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}));}
    }
    drag=null;
  };
  layer.addEventListener('pointerup',finish,true);
  layer.addEventListener('pointercancel',finish,true);
  return true;
}
root.AcademyPresentationObjectStageInteraction={install};
if(root.document)setTimeout(()=>install(root.document),0);
})(typeof globalThis!=='undefined'?globalThis:this);
