'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const preload=fs.readFileSync(path.join(root,'src/preload.js'),'utf8');
const shell=fs.readFileSync(path.join(root,'src/presentation-content-shell.js'),'utf8');

function src(name){return fs.readFileSync(path.join(root,'src',name),'utf8');}

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
