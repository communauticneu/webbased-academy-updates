const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');

test('V0.16.13 uses a dark hidden BrowserWindow until renderer ready', () => {
  const s = read('src/main.js');
  assert.match(s, /backgroundColor:\s*['"]#06131c['"]/);
  assert.match(s, /show:\s*false/);
  assert.match(s, /ready-to-show/);
  assert.match(s, /win\?\.show\(\)|win\.show\(\)/);
});

test('V0.16.13 is the package version', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.version, '0.16.13');
});

test('local avatar movement module exposes deterministic motion controller', () => {
  const motion = require('../src/local-avatar-motion');
  assert.equal(typeof motion.createLocalAvatarMotion, 'function');
  assert.equal(typeof motion.getDeterministicPose, 'function');
});

test('lip movement starts only while speaking and stops afterwards', () => {
  const { createLocalAvatarMotion } = require('../src/local-avatar-motion');
  const c = createLocalAvatarMotion();
  assert.equal(c.getState().speaking, false);
  c.setSpeaking(true);
  assert.equal(c.getState().speaking, true);
  assert.equal(c.getPose(250).mouthOpen, true);
  c.setSpeaking(false);
  assert.equal(c.getState().speaking, false);
  assert.equal(c.getPose(250).mouthOpen, false);
});

test('head body and blink motion are deterministic', () => {
  const { getDeterministicPose } = require('../src/local-avatar-motion');
  const a = getDeterministicPose(2200, { speaking:false, gesture:'front' });
  const b = getDeterministicPose(2200, { speaking:false, gesture:'front' });
  assert.deepEqual(a,b);
  assert.notEqual(a.headTilt, 0);
  assert.notEqual(a.bodyLift, 0);
  assert.equal(getDeterministicPose(4000,{speaking:false,gesture:'front'}).blink,true);
  assert.equal(getDeterministicPose(4200,{speaking:false,gesture:'front'}).blink,false);
});

test('front and point gestures are represented distinctly', () => {
  const { getDeterministicPose } = require('../src/local-avatar-motion');
  assert.equal(getDeterministicPose(1000,{gesture:'front'}).gesture,'front');
  assert.equal(getDeterministicPose(1000,{gesture:'point'}).gesture,'point');
});

test('HTML keeps full medium and hidden avatar modes and adds local motion hooks', () => {
  const s = read('src/index.html');
  assert.match(s,/data-v15mode="full"/);
  assert.match(s,/data-v15mode="medium"/);
  assert.match(s,/data-v15mode="hidden"/);
  assert.match(s,/local-avatar-motion\.js/);
  assert.match(s,/avatar-mouth/);
  assert.match(s,/avatar-eye/);
});

test('40-second production boundaries are unchanged', () => {
  const { PHASES, TOTAL_DURATION_SECONDS } = require('../src/production-mode');
  assert.equal(TOTAL_DURATION_SECONDS,40);
  assert.deepEqual(PHASES.map(p=>[p.id,p.start,p.end]),[
    ['avatar1',0,10],['board',10,25],['graphic',25,33],['avatar2',33,40]
  ]);
});

test('HeyGen remains click-triggered and has no automatic generation call', () => {
  const s = read('src/index.html');
  const main = read('src/main.js');
  assert.match(s,/generate\?\.addEventListener\(['"]click['"]/);
  assert.equal((main.match(/ipcMain\.handle\('heygen-generate-test'/g)||[]).length,1);
  assert.doesNotMatch(s,/DOMContentLoaded[^]{0,500}heygenGenerateTest/);
});

test('3440 layout readability safeguards remain present', () => {
  const s = read('src/index.html');
  assert.match(s,/@media \(min-width:1600px\)/);
  assert.match(s,/font-size:14px!important/);
  assert.match(s,/3440×1440 FIXED WORKSPACE/);
});
