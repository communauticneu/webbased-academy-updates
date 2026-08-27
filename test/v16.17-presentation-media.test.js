const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const fresh=()=>{delete require.cache[require.resolve('../src/free-presentation')];return require('../src/free-presentation');};

test('presentation-media feature is present in V0.16.17 or later',()=>{
  const version=JSON.parse(read('package.json')).version;
  const parts=version.split('.').map(Number);
  assert.equal(parts[0],0);
  assert.equal(parts[1],16);
  assert.ok(parts[2]>=17,`expected V0.16.17 or later, got ${version}`);
});

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
  assert.ok(s.presentationMedium);
  assert.ok(s.mediumPosition);
  assert.ok(s.mediumSize);
});

test('presentation media values are validated for predictable hardware-friendly effects',()=>{
  const {normalizeScene}=fresh();
  const s=normalizeScene({presentationMedium:'invalid',mediumPosition:'invalid',mediumSize:'invalid',mediumEnter:'invalid',mediumExit:'invalid',effectDuration:99});
  assert.notEqual(s.presentationMedium,'invalid');
  assert.notEqual(s.mediumPosition,'invalid');
  assert.notEqual(s.mediumSize,'invalid');
  assert.notEqual(s.mediumEnter,'invalid');
  assert.notEqual(s.mediumExit,'invalid');
  assert.ok(s.effectDuration<=2);
});
