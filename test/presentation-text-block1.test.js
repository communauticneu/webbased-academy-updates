const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const TextSystem=require(path.join(root,'src','presentation-text-system.js'));
const src=name=>fs.readFileSync(path.join(root,'src',name),'utf8');

test('text remains reselectable and movable after deselection',()=>{
 const engine=TextSystem.createEngine();
 const text=engine.addText('heading',{x:40,y:50});
 assert.equal(engine.moveSelected(20,10),true);
 engine.select(null);
 assert.equal(engine.select(text.id),true);
 assert.equal(engine.moveSelected(15,5),true);
 assert.equal(engine.getObject(text.id).x,75);
 assert.equal(engine.getObject(text.id).y,65);
 const runtime=src('presentation-text-system.js');
 assert.ok(runtime.includes('.stage>.avatar{z-index:10;pointer-events:none}'));
});

test('uses the newly approved medium-specific text sizes only in the central profile',()=>{
 assert.deepEqual(TextSystem.MEDIUM_PROFILES.board.sizes,{heading:39,normal:38,small:30});
 assert.deepEqual(TextSystem.MEDIUM_PROFILES.none.sizes,{heading:42,normal:33,small:25});
});

test('text-kind tabs use the same Creator primary-button visual language as Vorschau',()=>{
 const index=src('index.html');
 const shell=src('presentation-content-shell.js');
 assert.ok(index.includes('<button class="btn primary" id="freeTalkPlay" type="button">▶ Vorschau</button>'));
 assert.ok(index.includes('.btn.primary{background:#155075;border-color:#2a7ca8}'));
 assert.ok(shell.includes('.academy-text-kind-menu button{background:#155075;color:#eef6fb;border-color:#2a7ca8;border-radius:10px}'));
 assert.ok(shell.includes('.academy-text-kind-menu button:hover{background:#1d618b}'));
 assert.equal(shell.includes('#bfe8ff'),false);
 assert.equal(shell.includes('#d7f2ff'),false);
});
