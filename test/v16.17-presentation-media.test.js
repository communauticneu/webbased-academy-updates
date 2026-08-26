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

test('V0.16.17 keeps 40-second technical test unchanged',()=>{
  const {PHASES,TOTAL_DURATION_SECONDS}=require('../src/production-mode');
  assert.equal(TOTAL_DURATION_SECONDS,40);
  assert.deepEqual(PHASES.map(p=>[p.start,p.end]),[[0,10],[10,25],[25,33],[33,40]]);
});

test('V0.16.17 remains free of automatic external avatar generation',()=>{
  const js=read('src/free-presentation.js');
  assert.doesNotMatch(js,/fetch\(|axios|heygen/i);
});
