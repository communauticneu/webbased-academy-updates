(function(root){
'use strict';

const enabled=root.ACADEMY_POSTIT_ENABLED!==false;

function loadScript(src,onload){
 const script=document.createElement('script');
 script.src=src;
 if(onload)script.onload=onload;
 document.documentElement.appendChild(script);
}

function install(onReady){
 if(!enabled){
  if(onReady)onReady();
  return;
 }
 loadScript('presentation-postit-system.js',onReady);
}

root.AcademyPostItPackage=Object.freeze({enabled,install});
})(window);
