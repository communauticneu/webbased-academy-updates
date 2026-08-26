const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = () => fs.readFileSync(path.join(root,'src','index.html'),'utf8');

test('V0.16.12 exposes local and HeyGen avatar modes', () => {
  const s=html();
  assert.match(s,/value="local"[^>]*>Lokaler Testavatar/);
  assert.match(s,/value="heygen"[^>]*>HeyGen Testavatar/);
  assert.match(s,/Avatar-Test erzeugen/);
});

test('HeyGen UI keeps explicit user action and required fields', () => {
  const s=html();
  assert.match(s,/id="heygenApiKey"/);
  assert.match(s,/id="heygenAvatarId"/);
  assert.match(s,/id="heygenVoiceId"/);
  assert.match(s,/id="heygenTestText"/);
  assert.match(s,/Externe HeyGen-Anfrage/);
});

test('preload exposes only IPC methods, never an embedded API key', () => {
  const s=fs.readFileSync(path.join(root,'src','preload.js'),'utf8');
  assert.match(s,/heygenSaveApiKey/);
  assert.match(s,/heygenGenerateTest/);
  assert.doesNotMatch(s,/X-Api-Key\s*:/i);
});

test('main process uses Electron safeStorage for local API key protection', () => {
  const s=fs.readFileSync(path.join(root,'src','main.js'),'utf8');
  assert.match(s,/safeStorage/);
  assert.match(s,/encryptString/);
  assert.match(s,/decryptString/);
});

test('HeyGen polling recognizes waiting as a nonterminal render status', async () => {
  const { pollVideoStatus } = require('../src/heygen-service');
  const states=['waiting','processing','completed'];
  let i=0;
  const fetchImpl=async()=>({ok:true,json:async()=>({data:{status:states[i++],video_url:'https://example.test/avatar.mp4'}})});
  const seen=[];
  const result=await pollVideoStatus({apiKey:'x',videoId:'v1',fetchImpl,delay:async()=>{},onStatus:s=>seen.push(s)});
  assert.deepEqual(seen,['waiting','processing','completed']);
  assert.equal(result.videoUrl,'https://example.test/avatar.mp4');
});

test('HeyGen validation returns understandable German errors', async () => {
  const { generateAvatarVideo } = require('../src/heygen-service');
  await assert.rejects(()=>generateAvatarVideo({apiKey:'',avatarId:'a',voiceId:'v',text:'Hallo'}),/API-Schlüssel fehlt/);
  await assert.rejects(()=>generateAvatarVideo({apiKey:'x',avatarId:'',voiceId:'v',text:'Hallo'}),/Avatar-ID fehlt/);
});

test('V0.16.11 readability safeguards remain present', () => {
  const s=html();
  assert.match(s,/V16\.11[^]*Lesbarkeitskorrektur|Lesbarkeitskorrektur[^]*V16\.11/);
  assert.match(s,/font-size:14px!important/);
});


test('network errors are converted into a German message without crashing', async () => {
  const { generateAvatarVideo } = require('../src/heygen-service');
  await assert.rejects(()=>generateAvatarVideo({apiKey:'x',avatarId:'a',voiceId:'v',text:'Hallo',fetchImpl:async()=>{throw new Error('offline')}}),/nicht erreichbar/);
});

test('HeyGen test panel does not consume vertical space in the 3440 layout', () => {
  const s=html();
  assert.match(s,/@media \(min-width:1600px\)\{\.heygen-test\{position:fixed!important/);
  assert.match(s,/right:440px!important/);
});
