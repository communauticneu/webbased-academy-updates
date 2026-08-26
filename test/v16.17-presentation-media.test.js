const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const fresh=()=>{delete require.cache[require.resolve('../src/free-presentation')];return require('../src/free-presentation');};

test('V0.16.17 scene model supports interchangeable presentation media',()=>{
  const {normalizeScene}=fresh();
  const s=normalizeScene({presentationMedium:'flipchart',mediumPosition:'left',mediumSize:'large',mediumEnter:'slide-left',mediumExit:'fade',effectDuration:0.8});
  assert.equal(s.presentationMedium,'flipchart');
  assert.equal(s.mediumPosition,'left');
  assert.equal(s.mediumSize,'large');
  assert.equal(s.mediumEnter,'slide-left');
  assert.equal(s.mediumExit,'fade');
  assert.equal(s.effectDuration,0.8);
});

test('older scenes receive safe presentation-medium defaults',()=>{
  const {normalizeScene}=fresh(); const s=normalizeScene({kind:'board'});
  assert.equal(s.presentationMedium,'chalkboard');
  assert.equal(s.presentationVisible,true);
  assert.equal(s.mediumPosition,'right');
  assert.equal(s.mediumSize,'large');
  assert.equal(s.mediumEnter,'fade');
  assert.equal(s.mediumExit,'fade');
});

test('presentation media values are validated for predictable hardware-friendly effects',()=>{
  const {normalizeScene}=fresh(); const s=normalizeScene({presentationMedium:'x',mediumPosition:'x',mediumSize:'x',mediumEnter:'spin3d',mediumExit:'gpu',effectDuration:99});
  assert.equal(s.presentationMedium,'chalkboard');
  assert.equal(s.mediumPosition,'right');
  assert.equal(s.mediumSize,'large');
  assert.equal(s.mediumEnter,'fade');
  assert.equal(s.mediumExit,'fade');
  assert.equal(s.effectDuration,2);
});

test('scene model supports explicit presentation-medium visibility',()=>{
  const {normalizeScene}=fresh();
  assert.equal(normalizeScene({presentationVisible:false}).presentationVisible,false);
  assert.equal(normalizeScene({}).presentationVisible,true);
});

test('Academy stage module exposes a dedicated interchangeable presentation surface',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/id=\\"presentationSurface\\"/);
  assert.match(js,/presentation-surface/);
  assert.match(js,/presentation-chalkboard/);
  assert.match(js,/presentation-flipchart/);
  assert.match(js,/presentation-whiteboard/);
  assert.match(js,/Rahmenlose Academy-Fläche/);
});

test('supplied chalkboard texture is used as the Academy board surface',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/assets\/tafel-academy\.jpg/);
  assert.ok(fs.existsSync(path.join(root,'src','assets','tafel-academy.jpg')));
});

test('scene editor module exposes medium type position size visibility and effects',()=>{
  const js=read('src/free-presentation.js');
  for(const id of ['ftPresentationMedium','ftMediumPosition','ftMediumSize','ftPresentationVisible','ftMediumEnter','ftMediumExit','ftEffectDuration']){
    assert.match(js,new RegExp(id));
  }
  assert.match(js,/Hineinfahren von links/);
  assert.match(js,/Herausfahren nach rechts/);
});

test('free-talk stage application drives the presentation surface without GPU-heavy rendering',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/function applyPresentationSurface\(scene,doc\)/);
  assert.match(js,/surface\.dataset\.medium=s\.presentationMedium/);
  assert.match(js,/surface\.dataset\.position=s\.mediumPosition/);
  assert.match(js,/surface\.dataset\.size=s\.mediumSize/);
  assert.match(js,/surface\.dataset\.enter=s\.mediumEnter/);
  assert.doesNotMatch(js,/WebGL|three\.js|canvas\.getContext\(['"]webgl/i);
});

test('board scenes can combine board text with the selected media-library graphic',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/presentation-board-graphic/);
  assert.match(js,/graphic\.src=s\.mediumUrl/);
  assert.match(js,/graphic\.hidden=!s\.mediumUrl/);
});

test('scene completion applies the configured exit effect before the next scene',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/function hidePresentationSurface\(scene,doc\)/);
  assert.match(js,/surface\.dataset\.enter=s\.mediumExit/);
  assert.match(js,/hidePresentationSurface\(scenes\[sceneIndex\],doc\)/);
});

test('presentation surface uses lightweight CSS transitions for fade and slide effects',()=>{
  const js=read('src/free-presentation.js');
  assert.match(js,/transition-property:transform,opacity/);
  assert.match(js,/slide-left/);
  assert.match(js,/slide-right/);
  assert.match(js,/slide-top/);
  assert.match(js,/slide-bottom/);
  assert.match(js,/effectDuration/);
});

test('V0.16.17 keeps 40-second technical test unchanged',()=>{
  const {PHASES,TOTAL_DURATION_SECONDS}=require('../src/production-mode');
  assert.equal(TOTAL_DURATION_SECONDS,40);
  assert.deepEqual(PHASES.map(p=>[p.start,p.end]),[[0,10],[10,25],[25,33],[33,40]]);
});

test('V0.16.17 remains free of automatic external avatar generation',()=>{
  const js=read('src/free-presentation.js');
  assert.doesNotMatch(js,/fetch\(|axios|heygen/i);
});
