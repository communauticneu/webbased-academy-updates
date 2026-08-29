(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.AcademyPresentationTextarea=api;
  if(root&&root.document)api.install(root.document);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function ensureStyle(doc){
  if(doc.getElementById('academyPresentationTextareaStyle'))return;
  const style=doc.createElement('style');
  style.id='academyPresentationTextareaStyle';
  style.textContent='#academyBoardObjectProperties textarea[data-prop="content"]{width:100%;min-height:48px;box-sizing:border-box;margin-top:2px;background:#0b1a24;border:1px solid #234052;color:#eef6fb;border-radius:6px;padding:5px 6px;font:inherit;line-height:1.25;resize:vertical}';
  doc.head?.appendChild(style);
}
function upgrade(doc){
  const input=doc?.querySelector?.('#academyBoardObjectProperties input[data-prop="content"]');
  if(!input||!input.parentNode)return false;
  ensureStyle(doc);
  const textarea=doc.createElement('textarea');
  textarea.setAttribute('data-prop','content');
  textarea.setAttribute('rows','2');
  textarea.value=input.value||'';
  textarea.className=input.className||'';
  input.parentNode.replaceChild(textarea,input);
  textarea.addEventListener('input',()=>{
    input.value=textarea.value;
    input.dispatchEvent?.(new Event('input',{bubbles:true}));
  });
  return true;
}
function install(doc){
  if(!doc)return false;
  ensureStyle(doc);
  if(upgrade(doc))return true;
  setTimeout(()=>upgrade(doc),0);
  setTimeout(()=>upgrade(doc),250);
  return true;
}
return {upgrade,install};
});
