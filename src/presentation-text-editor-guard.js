(function(root){
'use strict';
const SCENE_TEXT_SYNC_ENABLED=false;
const base=root.AcademyTextSystem;
if(!base)return;
root.AcademyTextSystem=Object.freeze({
 ...base,
 replaceObjects:()=>false,
 beginPreview:()=>false,
 endPreview:()=>false
});
root.AcademyTextEditorIsolation=Object.freeze({sceneTextSyncEnabled:SCENE_TEXT_SYNC_ENABLED});
})(typeof globalThis!=='undefined'?globalThis:this);
