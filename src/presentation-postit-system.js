(function(root,factory){
'use strict';
const api=factory(root?.AcademyTextSystem);
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.AcademyPostItSystem=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(textSystem){
'use strict';
const POSTIT_PALETTE=Object.freeze({darkYellow:'#c99a00',green:'#4f9b57',beige:'#c9b88a',red:'#a83d36',cyan:'#4f9fb4',lightGray:'#b8b8b2'});
const DEFAULT_POSTIT=Object.freeze({content:'Neues Post it',colorKey:'darkYellow',align:'center',width:330,height:58,minWidth:330,minHeight:58,x:64,y:72});
const POSTIT_MEDIUM_PROFILES=Object.freeze({none:Object.freeze({fontFamily:'Trebuchet MS',fontWeight:700,fontSize:39,textColor:'#202020',surface:'paper'}),board:Object.freeze({fontFamily:'KG Second Chances Sketch',fontWeight:400,fontSize:39,textColor:'#ffffff',surface:'chalkboard'})});
let nextId=1;
function number(value,fallback){return Number.isFinite(value)?value:fallback;}
function createPostIt(overrides={}){const colorKey=Object.prototype.hasOwnProperty.call(POSTIT_PALETTE,overrides.colorKey)?overrides.colorKey:DEFAULT_POSTIT.colorKey;return {id:typeof overrides.id==='string'&&overrides.id?overrides.id:`academy-postit-${nextId++}`,content:typeof overrides.content==='string'?overrides.content:DEFAULT_POSTIT.content,colorKey,align:'center',width:Math.max(DEFAULT_POSTIT.minWidth,number(overrides.width,DEFAULT_POSTIT.width)),height:Math.max(DEFAULT_POSTIT.minHeight,number(overrides.height,DEFAULT_POSTIT.height)),minWidth:DEFAULT_POSTIT.minWidth,minHeight:DEFAULT_POSTIT.minHeight,x:Math.max(0,number(overrides.x,DEFAULT_POSTIT.x)),y:Math.max(0,number(overrides.y,DEFAULT_POSTIT.y))};}
function resolvePostItStyle(item,medium='none'){if(!item)throw new Error('Post-it object required');const own=POSTIT_MEDIUM_PROFILES[medium];if(!own)throw new Error(`Unsupported presentation medium: ${medium}`);if(medium==='board'&&textSystem?.MEDIUM_PROFILES?.board){const board=textSystem.MEDIUM_PROFILES.board;return {fontFamily:board.fonts.heading,fontWeight:board.weights.heading,fontSize:board.sizes.heading,textColor:board.defaultColor,paperColor:POSTIT_PALETTE[item.colorKey],surface:own.surface};}return {...own,paperColor:POSTIT_PALETTE[item.colorKey]};}
function duplicatePostIt(item){return createPostIt({...item,id:undefined,x:item.x+18,y:item.y+18});}
function createEngine(){const objects=[];let selectedId=null,editingId=null,medium='none';const find=id=>objects.find(item=>item.id===id)||null;const copy=item=>item?{...item}:null;
 function addPostIt(overrides={}){const item=createPostIt(overrides);objects.push(item);selectedId=item.id;editingId=null;return copy(item);}
 function select(id){if(id===null){selectedId=null;editingId=null;return true;}if(!find(id))return false;selectedId=id;if(editingId!==id)editingId=null;return true;}
 function beginEdit(id=selectedId){if(!id||!find(id))return false;selectedId=id;editingId=id;return true;}
 function endEdit(){if(!editingId)return false;editingId=null;return true;}
 function updateContent(content){const item=find(editingId);if(!item||typeof content!=='string')return false;item.content=content;return true;}
 function moveSelected(dx,dy){const item=find(selectedId);if(!item||editingId)return false;item.x=Math.max(0,item.x+number(dx,0));item.y=Math.max(0,item.y+number(dy,0));return true;}
 function resizeSelected(width,height){const item=find(selectedId);if(!item||editingId)return false;item.width=Math.max(item.minWidth,number(width,item.width));item.height=Math.max(item.minHeight,number(height,item.height));return true;}
 function setColor(colorKey){const item=find(selectedId);if(!item||!Object.prototype.hasOwnProperty.call(POSTIT_PALETTE,colorKey))return false;item.colorKey=colorKey;return true;}
 function duplicateSelected(){const item=find(selectedId);if(!item)return null;const duplicate=duplicatePostIt(item);objects.push(duplicate);selectedId=duplicate.id;editingId=null;return copy(duplicate);}
 function deleteSelected(){if(!selectedId||editingId)return false;const index=objects.findIndex(item=>item.id===selectedId);if(index<0)return false;objects.splice(index,1);selectedId=null;return true;}
 function setMedium(next){if(!POSTIT_MEDIUM_PROFILES[next])throw new Error(`Unsupported presentation medium: ${next}`);medium=next;return true;}
 return Object.freeze({addPostIt,select,beginEdit,endEdit,updateContent,moveSelected,resizeSelected,setColor,duplicateSelected,deleteSelected,setMedium,getObject:id=>copy(find(id)),getObjects:()=>objects.map(copy),getState:()=>({selectedId,editingId,medium}),getResolvedStyle:id=>{const item=find(id);return item?resolvePostItStyle(item,medium):null;}});}
return Object.freeze({POSTIT_PALETTE,DEFAULT_POSTIT,POSTIT_MEDIUM_PROFILES,createPostIt,resolvePostItStyle,duplicatePostIt,createEngine});
});
