const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');

function freshModel(){
  delete require.cache[require.resolve('../src/free-presentation')];
  return require('../src/free-presentation');
}

test('V0.16.14 free-presentation behavior remains available in later versions', () => {
  const pkg = JSON.parse(read('package.json'));
  const [major,minor,patch]=pkg.version.split('.').map(Number);
  assert.ok(major>0 || minor>16 || (minor===16 && patch>=14));
});

test('free presentation model supports add duplicate delete and move', () => {
  const { createPresentationModel } = freshModel();
  const m = createPresentationModel([{ name:'A', duration:12 }, { name:'B', duration:20 }]);
  m.add({ name:'C', duration:8 });
  assert.deepEqual(m.getScenes().map(s=>s.name), ['A','B','C']);
  m.duplicate(1);
  assert.deepEqual(m.getScenes().map(s=>s.name), ['A','B','B · Kopie','C']);
  m.move(2,-1);
  assert.deepEqual(m.getScenes().map(s=>s.name), ['A','B · Kopie','B','C']);
  m.remove(2);
  assert.deepEqual(m.getScenes().map(s=>s.name), ['A','B · Kopie','C']);
});

test('scene duration determines automatic total duration', () => {
  const { createPresentationModel } = freshModel();
  const m = createPresentationModel([{name:'1',duration:12},{name:'2',duration:20},{name:'3',duration:8}]);
  assert.equal(m.totalDuration(), 40);
  m.update(1,{duration:10});
  assert.equal(m.totalDuration(), 30);
});

test('scene normalization supplies older projects with safe defaults', () => {
  const { normalizeScene } = freshModel();
  const s = normalizeScene({ name:'Alt', duration:5 });
  assert.equal(s.kind,'avatar');
  assert.equal(s.avatarMode,'medium');
  assert.equal(s.speechText,'');
  assert.equal(s.gesture,'front');
  assert.equal(s.boardText,'');
  assert.equal(s.mediumId,'');
  assert.equal(s.transition,'cut');
});

test('presentation runner advances scenes and exposes scene/total clocks', () => {
  const { createPresentationRunner } = freshModel();
  const entered=[];
  const r=createPresentationRunner([
    {name:'A',duration:2},{name:'B',duration:3}
  ],{ onSceneEnter:(s,i)=>entered.push([s.name,i]) });
  r.start();
  r.advance(1.5);
  assert.equal(r.getState().sceneIndex,0);
  assert.equal(r.getState().sceneTime,1.5);
  r.advance(1);
  assert.equal(r.getState().sceneIndex,1);
  assert.equal(r.getState().totalTime,2.5);
  assert.deepEqual(entered,[['A',0],['B',1]]);
});

test('presentation runner pause continue stop and reset are reliable', () => {
  const { createPresentationRunner } = freshModel();
  const r=createPresentationRunner([{name:'A',duration:2},{name:'B',duration:2}]);
  r.start();r.advance(1);r.pause();r.advance(1);
  assert.equal(r.getState().totalTime,1);
  r.start();r.advance(.5);assert.equal(r.getState().totalTime,1.5);
  r.stop();assert.equal(r.getState().running,false);assert.equal(r.getState().stopped,true);
  r.reset();assert.equal(r.getState().totalTime,0);assert.equal(r.getState().sceneIndex,0);
});

test('scene fields support avatar board graphic background speech gesture and transition', () => {
  const { normalizeScene } = freshModel();
  const s=normalizeScene({
    name:'Demo',duration:7,kind:'graphic',avatarMode:'hidden',speechText:'Hallo',gesture:'point',boardText:'Tafel',mediumId:'img-1',transition:'fade'
  });
  assert.deepEqual({kind:s.kind,avatarMode:s.avatarMode,speechText:s.speechText,gesture:s.gesture,boardText:s.boardText,mediumId:s.mediumId,transition:s.transition},{
    kind:'graphic',avatarMode:'hidden',speechText:'Hallo',gesture:'point',boardText:'Tafel',mediumId:'img-1',transition:'fade'
  });
});

test('project migration preserves existing data and adds presentation scenes', () => {
  const { migrateProjectData } = freshModel();
  const old={version:'V9',project:{name:'Alt'},states:[{name:'Szene 1',camera:'full'}],storyboard:[{name:'S1',duration:6,state:{camera:'full',board:true}}]};
  const migrated=migrateProjectData(old);
  assert.equal(migrated.project.name,'Alt');
  assert.equal(migrated.states.length,1);
  assert.equal(migrated.presentationScenes.length,1);
  assert.equal(migrated.presentationScenes[0].name,'S1');
  assert.equal(migrated.presentationScenes[0].duration,6);
});

test('HTML exposes free presentation editor and preview without automatic HeyGen', () => {
  const s=read('src/index.html');
  assert.match(s,/free-presentation\.js/);
  assert.match(s,/id="freeTalkTab"/);
  assert.match(s,/id="freeTalkEditor"/);
  assert.match(s,/id="freeTalkPlay"/);
  assert.match(s,/id="freeTalkPause"/);
  assert.match(s,/id="freeTalkStop"/);
  assert.match(s,/id="freeTalkReset"/);
  assert.doesNotMatch(s,/freeTalk[^]{0,600}heygenGenerateTest/);
});


test('free preview starts the scene speech and local avatar state without HeyGen', () => {
  const s=read('src/index.html');
  assert.match(s,/speak\(s\.speechText\|\|''\)/);
  assert.match(s,/clickCamera\(s\.avatarMode\)/);
  assert.match(s,/action\.value=s\.gesture==='point'\?'point':'front'/);
  assert.doesNotMatch(s,/function applyScene\([^]{0,1400}heygen/i);
});

test('scene display kind drives board graphic and background on the Academy stage', () => {
  const s=read('src/index.html');
  assert.match(s,/board\.classList\.toggle\('show',s\.kind==='board'\)/);
  assert.match(s,/graphic\.classList\.toggle\('show',s\.kind==='graphic'\)/);
  assert.match(s,/background\.classList\.toggle\('show',s\.kind==='background'\)/);
});

test('new presentation scenes are included in project, workspace, backup and local persistence', () => {
  const s=read('src/index.html');
  const occurrences=(s.match(/presentationScenes:window\.__freePresentationScenes\?\.\(\)\|\|\[\]/g)||[]).length;
  assert.ok(occurrences>=5,`expected at least 5 persistence hooks, found ${occurrences}`);
  assert.match(s,/window\.__freePresentationLoad\?\.\(data\)/);
  assert.match(s,/window\.__freePresentationLoad\?\.\(d\)/);
});

test('free presentation UI reuses the fixed production panel instead of adding a tall permanent sidebar', () => {
  const s=read('src/index.html');
  assert.match(s,/class="panel v160-regie"[^]*id="fixedTestTab"[^]*id="freeTalkTab"/);
  assert.match(s,/id="freeTalkDrawer" hidden/);
});

test('40-second production mode remains exactly unchanged', () => {
  const { PHASES, TOTAL_DURATION_SECONDS } = require('../src/production-mode');
  assert.equal(TOTAL_DURATION_SECONDS,40);
  assert.deepEqual(PHASES.map(p=>[p.id,p.start,p.end]),[
    ['avatar1',0,10],['board',10,25],['graphic',25,33],['avatar2',33,40]
  ]);
});

test('hardware-friendly implementation uses timers, DOM and speech synthesis only', () => {
  const js = read('src/free-presentation.js');
  const html = read('src/index.html');
  assert.doesNotMatch(js,/tensorflow|onnx|webgpu|cuda|torch|transformers/i);
  assert.doesNotMatch(html,/freeTalk[^]{0,1000}(tensorflow|onnx|webgpu|cuda|torch|transformers)/i);
});

test('3440 readability/layout safeguards remain intact', () => {
  const s=read('src/index.html');
  assert.match(s,/@media \(min-width:1600px\)/);
  assert.match(s,/font-size:14px!important/);
  assert.match(s,/3440×1440 FIXED WORKSPACE/);
});
