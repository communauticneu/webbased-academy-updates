const test=require('node:test');
const assert=require('node:assert/strict');
const TextSystem=require('../src/presentation-text-system.js');
const FreePresentation=require('../src/free-presentation.js');

function withTextEngine(engine,fn){
 const previous=globalThis.AcademyTextSystem;
 globalThis.AcademyTextSystem={getEngine:()=>engine};
 try{return fn();}finally{if(previous===undefined)delete globalThis.AcademyTextSystem;else globalThis.AcademyTextSystem=previous;}
}

test('preview uses the same text engine and restores the exact editor state afterwards',()=>{
 const engine=TextSystem.createEngine();
 const editor=engine.addText('heading',{content:'Arbeitsfassung',x:81,y:92,align:'center',customColor:'#12abef'});
 engine.setMedium('none');
 engine.select(editor.id);
 const beforeObjects=engine.getObjects();
 const beforeState=engine.getState();
 const preview=[TextSystem.createTextObject('normal',{content:'Vorschautext',x:140,y:155,align:'right',customColor:'#f0a000'})];
 assert.equal(engine.beginPreview(preview,'board'),true);
 assert.equal(engine.getState().previewing,true);
 assert.equal(engine.getState().selectedId,null);
 assert.equal(engine.getState().editingId,null);
 assert.equal(engine.getState().medium,'board');
 assert.deepEqual(engine.getObjects().map(({id,...o})=>o),preview.map(({id,...o})=>o));
 assert.equal(engine.beginEdit(engine.getObjects()[0].id),false);
 assert.equal(engine.moveSelected(10,10),false);
 assert.equal(engine.deleteSelected(),false);
 assert.equal(engine.endPreview(),true);
 assert.deepEqual(engine.getObjects(),beforeObjects);
 assert.deepEqual(engine.getState(),beforeState);
});

test('scene model stores current text objects without inventing a second font or style model',()=>withTextEngine(TextSystem.createEngine(),()=>{
 const engine=globalThis.AcademyTextSystem.getEngine();
 const model=FreePresentation.createPresentationModel([{name:'Szene 1',kind:'board',boardText:'Alttext'}]);
 engine.addText('heading',{content:'Neue Überschrift',x:44,y:55,align:'left'});
 engine.addText('small',{content:'Hinweis',x:66,y:77,customColor:'#44cc88'});
 const scene=model.getScenes()[0];
 assert.equal(scene.boardText,'Alttext');
 assert.deepEqual(scene.textObjects.map(o=>({content:o.content,kind:o.kind,x:o.x,y:o.y,align:o.align,customColor:o.customColor})),[
  {content:'Neue Überschrift',kind:'heading',x:44,y:55,align:'left',customColor:null},
  {content:'Hinweis',kind:'small',x:66,y:77,align:'left',customColor:'#44cc88'}
 ]);
 assert.equal(Object.hasOwn(scene.textObjects[0],'fontFamily'),false);
 assert.equal(Object.hasOwn(scene.textObjects[0],'fontSize'),false);
}));

test('switching scenes stores the old scene text and loads the selected scene text into the same editor engine',()=>withTextEngine(TextSystem.createEngine(),()=>{
 const engine=globalThis.AcademyTextSystem.getEngine();
 const model=FreePresentation.createPresentationModel([
  {name:'A',kind:'avatar',textObjects:[]},
  {name:'B',kind:'board',textObjects:[{id:'scene-b-heading',content:'Szene B',kind:'heading',x:120,y:130,align:'center',customColor:null}]}
 ]);
 engine.addText('normal',{content:'Szene A bearbeitet',x:20,y:30});
 const selected=model.get(1);
 assert.equal(selected.textObjects[0].content,'Szene B');
 assert.equal(engine.getObjects()[0].content,'Szene B');
 assert.equal(engine.getState().medium,'board');
 const scenes=model.getScenes();
 assert.equal(scenes[0].textObjects[0].content,'Szene A bearbeitet');
}));

test('preview runner renders each scene text set and restores editing state on stop reset and completion',()=>withTextEngine(TextSystem.createEngine(),()=>{
 const engine=globalThis.AcademyTextSystem.getEngine();
 engine.addText('heading',{content:'Editor bleibt erhalten',x:10,y:20});
 const original=engine.getObjects();
 const scenes=[
  {name:'Ohne Medium',duration:1,kind:'avatar',textObjects:[{id:'one',content:'Raumtext',kind:'normal',x:30,y:40,align:'left',customColor:null}]},
  {name:'Tafel',duration:1,kind:'board',textObjects:[{id:'two',content:'Tafeltext',kind:'heading',x:50,y:60,align:'center',customColor:null}]}
 ];
 const runner=FreePresentation.createPresentationRunner(scenes);
 runner.start();
 assert.equal(engine.getState().previewing,true);
 assert.equal(engine.getState().medium,'none');
 assert.equal(engine.getObjects()[0].content,'Raumtext');
 runner.advance(1);
 assert.equal(engine.getState().medium,'board');
 assert.equal(engine.getObjects()[0].content,'Tafeltext');
 runner.stop();
 assert.equal(engine.getState().previewing,false);
 assert.deepEqual(engine.getObjects(),original);
 runner.start();
 runner.reset();
 assert.equal(engine.getState().previewing,false);
 assert.deepEqual(engine.getObjects(),original);
 runner.start();
 runner.advance(2);
 assert.equal(engine.getState().previewing,false);
 assert.deepEqual(engine.getObjects(),original);
}));

test('legacy boardText remains a fallback only when a scene has no new text objects',()=>{
 const legacy=FreePresentation.normalizeScene({kind:'board',boardText:'Historischer Tafelsatz'});
 const modern=FreePresentation.normalizeScene({kind:'board',boardText:'Historischer Tafelsatz',textObjects:[{id:'modern',content:'Neuer Text',kind:'normal',x:1,y:2,align:'left',customColor:null}]});
 assert.equal(legacy.boardText,'Historischer Tafelsatz');
 assert.deepEqual(legacy.textObjects,[]);
 assert.equal(modern.textObjects[0].content,'Neuer Text');
 const source=require('node:fs').readFileSync(require('node:path').join(__dirname,'..','src','free-presentation.js'),'utf8');
 assert.match(source,/txt\.textContent=s\.textObjects\.length\?'':\(s\.boardText\|\|''\)/);
});
