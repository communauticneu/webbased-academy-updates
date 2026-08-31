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
 assert.ok(medium.includes("medium:'board'"));
 assert.ok(medium.includes("medium:'none'"));
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
