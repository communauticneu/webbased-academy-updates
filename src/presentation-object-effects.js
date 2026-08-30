(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.AcademyPresentationObjectEffects=api;
  if(root&&root.document){const boot=()=>api.install(root.document);if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
'use strict';
function enterEffectForType(type){return ({text:'write',postit:'unroll',arrow:'draw',circle:'draw',line:'draw',graphic:'fade'})[type]||'fade';}
function previewButtonMarkup(){return '<button type="button" data-board-preview>Effekt testen</button>';}
function effectStyles(){return '@keyframes academy-write-in{from{clip-path:inset(0 100% 0 0);opacity:.35}to{clip-path:inset(0 0 0 0);opacity:1}}@keyframes academy-unroll-in{from{transform:scaleX(.03);clip-path:inset(0 97% 0 0);opacity:.65}to{transform:scaleX(1);clip-path:inset(0 0 0 0);opacity:1}}@keyframes academy-draw-in{from{clip-path:inset(0 100% 0 0);opacity:.15}to{clip-path:inset(0 0 0 0);opacity:1}}@keyframes academy-fade-in{from{opacity:0}to{opacity:1}}@keyframes academy-wipe-out{from{clip-path:inset(0 0 0 0);opacity:1}to{clip-path:inset(0 0 0 100%);opacity:.08}}.academy-board-object.academy-effect-preview{will-change:clip-path,opacity,transform}.academy-board-object.academy-effect-write{animation:academy-write-in .95s steps(18,end) both}.academy-board-object.academy-effect-unroll{transform-origin:left center;animation:academy-unroll-in .85s cubic-bezier(.22,.8,.28,1) both}.academy-board-object.academy-effect-draw{animation:academy-draw-in .8s ease-out both}.academy-board-object.academy-effect-fade{animation:academy-fade-in .5s ease-out both}.academy-board-object.academy-effect-wipe{animation:academy-wipe-out .65s ease-in both}';}
function typeForNode(node){const cls=String(node?.className||'');for(const type of ['text','postit','graphic','arrow','circle','line'])if(cls.includes(`academy-board-object-${type}`))return type;return 'graphic';}
function runPreview(doc,node){if(!node)return false;const effect=enterEffectForType(typeForNode(node));const classes=['academy-effect-preview','academy-effect-write','academy-effect-unroll','academy-effect-draw','academy-effect-fade','academy-effect-wipe'];node.classList.remove(...classes);void node.offsetWidth;node.classList.add('academy-effect-preview',`academy-effect-${effect}`);root.setTimeout?.(()=>{node.classList.remove(`academy-effect-${effect}`);void node.offsetWidth;node.classList.add('academy-effect-wipe');},1150);root.setTimeout?.(()=>node.classList.remove('academy-effect-preview','academy-effect-wipe'),1900);return true;}
function applyBoardBodyFont(doc){
  const surface=doc?.getElementById?.('presentationSurface');
  const boardActive=surface&&surface.classList.contains('presentation-chalkboard')&&surface.classList.contains('is-visible')&&surface.getAttribute('aria-hidden')!=='true'&&surface.dataset.medium==='chalkboard';
  if(!boardActive)return false;
  const family='"Segoe Print","Comic Sans MS",cursive';
  doc.querySelectorAll?.('.academy-board-object-text.academy-text-normal,.academy-board-object-text.academy-text-small')?.forEach(node=>{
    const size=node.classList.contains('academy-text-normal')?'25px':'23px';
    const text=node.querySelector?.('span');
    node.style.setProperty('font-family',family,'important');
    node.style.setProperty('font-size',size,'important');
    node.style.setProperty('font-style','normal','important');
    node.style.setProperty('font-weight','400','important');
    node.style.setProperty('font-synthesis','none','important');
    node.style.setProperty('text-shadow','0 0 1px rgba(255,255,255,.35)','important');
    node.style.setProperty('filter','none','important');
    if(text){
      text.style.setProperty('font-family',family,'important');
      text.style.setProperty('font-size',size,'important');
      text.style.setProperty('font-style','normal','important');
      text.style.setProperty('font-weight','400','important');
      text.style.setProperty('font-synthesis','none','important');
      text.style.setProperty('text-shadow','0 0 1px rgba(255,255,255,.35)','important');
      text.style.setProperty('filter','none','important');
      text.style.setProperty('letter-spacing','0','important');
    }
  });
  return true;
}
function install(doc){
  if(!doc)return false;
  if(!doc.getElementById('academyBoardObjectEffectsStyle')){const style=doc.createElement('style');style.id='academyBoardObjectEffectsStyle';style.textContent=effectStyles();doc.head?.appendChild(style);}
  const actions=doc.querySelector('.academy-board-quick-actions');
  if(actions&&!actions.querySelector('[data-board-preview]')){const wrap=doc.createElement('span');wrap.innerHTML=previewButtonMarkup();const button=wrap.firstElementChild;actions.insertBefore(button,actions.firstChild);button.addEventListener('click',()=>runPreview(doc,doc.querySelector('.academy-board-object.selected')));}
  const layer=doc.getElementById('academyBoardObjectLayer'),surface=doc.getElementById('presentationSurface');
  const reapply=()=>root.setTimeout?.(()=>applyBoardBodyFont(doc),0);
  if(layer&&!layer.dataset.bodyFontObserver){layer.dataset.bodyFontObserver='1';new MutationObserver(reapply).observe(layer,{childList:true,subtree:true});}
  if(surface&&!surface.dataset.bodyFontObserver){surface.dataset.bodyFontObserver='1';new MutationObserver(reapply).observe(surface,{attributes:true,attributeFilter:['class','aria-hidden','data-medium']});}
  doc.addEventListener('pointerdown',reapply,true);
  doc.addEventListener('dblclick',reapply,true);
  applyBoardBodyFont(doc);
  return true;
}
return {enterEffectForType,previewButtonMarkup,effectStyles,typeForNode,runPreview,applyBoardBodyFont,install};
});