const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=name=>fs.readFileSync(path.join(__dirname,'..','src',name),'utf8');

test('preload loads exactly one new text runtime before the content shell',()=>{
 const preload=src('preload.js');
 const runtime="appendScript('presentation-text-system.js'";
 const shell="appendScript('presentation-content-shell.js'";
 assert.equal((preload.match(/presentation-text-system\.js/g)||[]).length,1);
 assert.ok(preload.indexOf(runtime)>=0);
 assert.ok(preload.indexOf(runtime)<preload.indexOf(shell));
});

test('content shell delegates the three text kinds to the text system',()=>{
 const shell=src('presentation-content-shell.js');
 assert.ok(shell.includes("data-text-kind=\"heading\""));
 assert.ok(shell.includes("data-text-kind=\"normal\""));
 assert.ok(shell.includes("data-text-kind=\"small\""));
 assert.ok(shell.includes('AcademyTextSystem'));
 assert.ok(shell.includes('addText'));
});

test('text kind controls use the Creator primary-button visual language',()=>{
 const shell=src('presentation-content-shell.js');
 assert.ok(shell.includes('.academy-text-kind-menu button{background:#155075;color:#eef6fb;border-color:#2a7ca8;border-radius:10px}'));
 assert.ok(shell.includes('.academy-text-kind-menu button:hover{background:#1d618b}'));
 assert.equal(shell.includes('#bfe8ff'),false);
 assert.equal(shell.includes('#d7f2ff'),false);
});

test('medium selector publishes board and none without owning font logic',()=>{
 const medium=src('presentation-medium-selection.js');
 assert.ok(medium.includes('academy-presentation-medium-change'));
 assert.ok(medium.includes("publishMedium(doc,'board')"));
 assert.ok(medium.includes("publishMedium(doc,'none')"));
 for(const forbidden of ['KG Second Chances Sketch','DJB Chalk It Up','fontFamily','font-family'])assert.equal(medium.includes(forbidden),false,`medium selector owns font logic: ${forbidden}`);
});

test('new text runtime owns font faces, object layer and direct editing behavior centrally',()=>{
 const text=src('presentation-text-system.js');
 assert.ok(text.includes('KGSecondChancesSketch.ttf'));
 assert.ok(text.includes('DJB Chalk It Up.ttf'));
 assert.ok(text.includes('academyTextObjectLayer'));
 assert.ok(text.includes('contentEditable'));
 assert.ok(text.includes('academy-presentation-medium-change'));
 assert.equal(text.includes('MutationObserver'),false);
 assert.equal(text.includes('FontFace'),false);
});

test('text runtime is the only active JavaScript owner of Academy text font assets',()=>{
 const srcDir=path.join(__dirname,'..','src');
 const assetMarkers=['KGSecondChancesSketch.ttf','DJB Chalk It Up.ttf'];
 const owners=[];
 for(const name of fs.readdirSync(srcDir).filter(name=>name.endsWith('.js'))){
  const content=fs.readFileSync(path.join(srcDir,name),'utf8');
  if(assetMarkers.some(marker=>content.includes(marker)))owners.push(name);
 }
 assert.deepEqual(owners,['presentation-text-system.js']);
});

test('post-it may reference the central board heading profile but owns no Academy font assets',()=>{
 const postit=src('presentation-postit-system.js');
 assert.ok(postit.includes('textSystem?.MEDIUM_PROFILES?.board'));
 assert.equal(postit.includes('KGSecondChancesSketch.ttf'),false);
 assert.equal(postit.includes('DJB Chalk It Up.ttf'),false);
 assert.equal(postit.includes('@font-face'),false);
});

test('delete controls route through the editing-safe engine deletion path',()=>{
 const text=src('presentation-text-system.js');
 assert.ok(text.includes("academy-text-delete"));
 assert.ok(text.includes("engine.deleteSelected()"));
 assert.ok(text.includes("academy-text-content[contenteditable=\"true\"]"));
});

test('text layer is hosted by the always-visible stage, not the presentation medium surface',()=>{
 const text=src('presentation-text-system.js');
 assert.ok(text.includes("const stage=doc.querySelector?.('.stage')"));
 assert.ok(text.includes('stage.appendChild(layer)'));
 assert.ok(text.includes('stage.appendChild(context)'));
 assert.equal(text.includes("const surface=doc.getElementById?.('presentationSurface');if(!surface)return false"),false);
});

test('text and character layer stays behind the avatar while avatar does not block text pointer access',()=>{
 const text=src('presentation-text-system.js');
 assert.ok(text.includes('#academyTextObjectLayer{position:absolute;inset:0;z-index:5;'));
 assert.ok(text.includes('.stage>.avatar{z-index:10;pointer-events:none}'));
});

test('double-click editing preserves native word selection across focus',()=>{
 const text=src('presentation-text-system.js');
 assert.ok(text.includes("state.editingId===object.id"));
 assert.ok(text.includes("!state.previewing"));
 assert.ok(text.includes("if(!isEditing&&content.textContent!==object.content)content.textContent=object.content"));
 assert.ok(text.includes('doc.getSelection?.()'));
 assert.ok(text.includes('cloneRange()'));
 assert.ok(text.includes('selection.addRange(savedRange)'));
 assert.equal(text.includes('range.collapse(false)'),false);
});
