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

test('text runtime is the only active JavaScript owner of Academy text fonts',()=>{
 const srcDir=path.join(__dirname,'..','src');
 const fontMarkers=['KG Second Chances Sketch','DJB Chalk It Up'];
 const owners=[];
 for(const name of fs.readdirSync(srcDir).filter(name=>name.endsWith('.js'))){
  const content=fs.readFileSync(path.join(srcDir,name),'utf8');
  if(fontMarkers.some(marker=>content.includes(marker)))owners.push(name);
 }
 assert.deepEqual(owners,['presentation-text-system.js']);
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
