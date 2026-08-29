(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.AcademyPresentationTextarea=api;
  if(root&&root.document)api.install(root.document);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function upgrade(doc){
  const input=doc?.querySelector?.('#academyBoardObjectProperties input[data-prop="content"]');
  if(!input||!input.parentNode)return false;
  const textarea=doc.createElement('textarea');
  textarea.setAttribute('data-prop','content');
  textarea.setAttribute('rows','2');
  textarea.value=input.value||'';
  textarea.className=input.className||'';
  input.parentNode.replaceChild(textarea,input);
  textarea.addEventListener('input',()=>input.dispatchEvent?.(new Event('input',{bubbles:true})));
  return true;
}
function install(doc){
  if(!doc)return false;
  if(upgrade(doc))return true;
  setTimeout(()=>upgrade(doc),0);
  setTimeout(()=>upgrade(doc),250);
  return true;
}
return {upgrade,install};
});
