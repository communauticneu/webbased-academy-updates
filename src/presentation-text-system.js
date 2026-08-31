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

 return Object.freeze({
  TEXT_KINDS,
  DEFAULT_CONTENT,
  MEDIUM_PROFILES,
  createTextObject,
  resolveStyle,
  duplicateTextObject
 });
});
