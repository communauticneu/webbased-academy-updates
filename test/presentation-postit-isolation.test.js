'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.join(__dirname,'..');
const preload=fs.readFileSync(path.join(root,'src/preload.js'),'utf8');
const shell=fs.readFileSync(path.join(root,'src/presentation-content-shell.js'),'utf8');

function src(name){return fs.readFileSync(path.join(root,'src',name),'utf8');}

test('isolated preload still schedules the content shell after the Post-it package',()=>{
 const scripts=[];
 let start;
 const document={
  createElement:tag=>({tag}),
  documentElement:{appendChild(node){scripts.push(node.src);node.onload?.();}},
  head:{appendChild(){}},
  addEventListener(){}
 };
 const window={addEventListener(type,fn){if(type==='DOMContentLoaded')start=fn;}};
 const electron={contextBridge:{exposeInMainWorld(){}},ipcRenderer:{invoke(){},on(){}},webFrame:{insertCSS(){}}};
 vm.runInNewContext(preload,{window,document,require:id=>id==='electron'?electron:require});
 start();
 assert.ok(scripts.includes('presentation-postit-package.js'));
 assert.ok(scripts.includes('presentation-content-shell.js'));
});

test('post-it is loaded through one optional package adapter',()=>{
 assert.match(preload,/presentation-postit-package\.js/);
 assert.doesNotMatch(preload,/appendScript\('presentation-postit-system\.js'/);
 assert.ok(fs.existsSync(path.join(root,'src/presentation-postit-package.js')));
});

test('platform shell remains safe when post-it package is absent',()=>{
 assert.match(shell,/AcademyPostItSystem\?\.addPostIt\?\.\(\)/);
 assert.doesNotMatch(shell,/presentation-postit-system/);
});

test('post-it package owns its implementation and no platform module imports it directly',()=>{
 const platformFiles=fs.readdirSync(path.join(root,'src')).filter(name=>name.endsWith('.js')&&!name.startsWith('presentation-postit-'));
 const offenders=platformFiles.filter(name=>src(name).includes('presentation-postit-system.js'));
 assert.deepEqual(offenders,[]);
});

test('post-it package can be disabled without changing platform source files',()=>{
 const adapter=src('presentation-postit-package.js');
 assert.match(adapter,/presentation-postit-system\.js/);
 assert.match(adapter,/ACADEMY_POSTIT_ENABLED/);
 assert.match(adapter,/!==\s*false/);
});

test('enabled package loads its Post-it implementation without a preload-world API call',()=>{
 const loaded=[];
 const document={createElement:()=>({}),documentElement:{appendChild(node){loaded.push(node.src);}}};
 const window={document};
 vm.runInNewContext(src('presentation-postit-package.js'),{window,document});
 assert.deepEqual(loaded,['presentation-postit-system.js']);
});
