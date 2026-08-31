(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.AcademyTextSystem=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';

 const TEXT_KINDS=Object.freeze(['heading','normal','small']);
 const DEFAULT_CONTENT=Object.freeze({
  heading:'Neue Überschrift',
  normal:'Neuer Text',
  small:'Neuer Text'
 });
 const MEDIUM_PROFILES=Object.freeze({
  none:Object.freeze({
   fonts:Object.freeze({heading:'Arial',normal:'Arial',small:'Arial'}),
   weights:Object.freeze({heading:700,normal:400,small:400}),
   defaultColor:'#ffffff'
  }),
  board:Object.freeze({
   fonts:Object.freeze({heading:'KG Second Chances Sketch',normal:'DJB Chalk It Up',small:'DJB Chalk It Up'}),
   weights:Object.freeze({heading:400,normal:400,small:400}),
   defaultColor:'#ffffff'
  })
 });

 let nextId=1;

 function assertKind(kind){
  if(!TEXT_KINDS.includes(kind))throw new Error(`Unsupported text kind: ${kind}`);
 }

 function assertMedium(medium){
  if(!Object.prototype.hasOwnProperty.call(MEDIUM_PROFILES,medium))throw new Error(`Unsupported presentation medium: ${medium}`);
 }

 function normalizeNumber(value,fallback){
  return Number.isFinite(value)?value:fallback;
 }

 function createTextObject(kind,overrides={}){
  assertKind(kind);
  return {
   id:`academy-text-${nextId++}`,
   content:typeof overrides.content==='string'?overrides.content:DEFAULT_CONTENT[kind],
   kind,
   x:normalizeNumber(overrides.x,48),
   y:normalizeNumber(overrides.y,48),
   align:['left','center','right'].includes(overrides.align)?overrides.align:'left',
   customColor:typeof overrides.customColor==='string'&&overrides.customColor?overrides.customColor:null
  };
 }

 function resolveStyle(textObject,medium='none'){
  assertKind(textObject?.kind);
  assertMedium(medium);
  const profile=MEDIUM_PROFILES[medium];
  return {
   fontFamily:profile.fonts[textObject.kind],
   fontWeight:profile.weights[textObject.kind],
   color:textObject.customColor||profile.defaultColor
  };
 }

 function duplicateTextObject(textObject){
  assertKind(textObject?.kind);
  return createTextObject(textObject.kind,{
   content:textObject.content,
   x:normalizeNumber(textObject.x,48)+18,
   y:normalizeNumber(textObject.y,48)+18,
   align:textObject.align,
   customColor:textObject.customColor
  });
 }

 function createEngine(){
  const objects=[];
  let selectedId=null;
  let editingId=null;
  let medium='none';

  function getObject(id){
   return objects.find(object=>object.id===id)||null;
  }

  function getObjects(){
   return objects.map(object=>({...object}));
  }

  function getState(){
   return {selectedId,editingId,medium};
  }

  function addText(kind,overrides={}){
   const object=createTextObject(kind,overrides);
   objects.push(object);
   selectedId=object.id;
   editingId=null;
   return {...object};
  }

  function select(id){
   if(id===null){selectedId=null;editingId=null;return true;}
   if(!getObject(id))return false;
   selectedId=id;
   if(editingId&&editingId!==id)editingId=null;
   return true;
  }

  function beginEdit(id=selectedId){
   if(!id||!getObject(id))return false;
   selectedId=id;
   editingId=id;
   return true;
  }

  function endEdit(){
   if(!editingId)return false;
   editingId=null;
   return true;
  }

  function updateContent(content){
   const object=getObject(editingId);
   if(!object||typeof content!=='string')return false;
   object.content=content;
   return true;
  }

  function deleteSelected(){
   if(!selectedId||editingId)return false;
   const index=objects.findIndex(object=>object.id===selectedId);
   if(index<0)return false;
   objects.splice(index,1);
   selectedId=null;
   return true;
  }

  function moveSelected(dx,dy){
   const object=getObject(selectedId);
   if(!object||editingId)return false;
   object.x=Math.max(0,object.x+normalizeNumber(dx,0));
   object.y=Math.max(0,object.y+normalizeNumber(dy,0));
   return true;
  }

  function setAlignment(align){
   const object=getObject(selectedId);
   if(!object||!['left','center','right'].includes(align))return false;
   object.align=align;
   return true;
  }

  function setCustomColor(color){
   const object=getObject(selectedId);
   if(!object)return false;
   object.customColor=typeof color==='string'&&color?color:null;
   return true;
  }

  function duplicateSelected(){
   const object=getObject(selectedId);
   if(!object)return null;
   const copy=duplicateTextObject(object);
   objects.push(copy);
   selectedId=copy.id;
   editingId=null;
   return {...copy};
  }

  function setMedium(nextMedium){
   assertMedium(nextMedium);
   if(medium===nextMedium)return false;
   medium=nextMedium;
   return true;
  }

  function getResolvedStyle(id){
   const object=getObject(id);
   return object?resolveStyle(object,medium):null;
  }

  return Object.freeze({
   addText,
   select,
   beginEdit,
   endEdit,
   updateContent,
   deleteSelected,
   moveSelected,
   setAlignment,
   setCustomColor,
   duplicateSelected,
   setMedium,
   getObject:id=>{const object=getObject(id);return object?{...object}:null;},
   getObjects,
   getState,
   getResolvedStyle
  });
 }

 return Object.freeze({
  TEXT_KINDS,
  DEFAULT_CONTENT,
  MEDIUM_PROFILES,
  createTextObject,
  resolveStyle,
  duplicateTextObject,
  createEngine
 });
});
