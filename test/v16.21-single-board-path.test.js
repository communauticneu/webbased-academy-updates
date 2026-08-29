const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('legacy board button is routed to presentationSurface instead of boardOverlay',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  const fn=js.match(/function bindLegacyBoardToggle\(doc\)[\s\S]*?\n  }/);
  assert.ok(fn,'bindLegacyBoardToggle missing');
  assert.match(fn[0],/presentationSurface/);
  assert.doesNotMatch(fn[0],/getElementById\('boardOverlay'\)/);
});

test('legacy brown board can never render on stage',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.stage #boardOverlay\s*\{[\s\S]*?display:\s*none!important/);
});

test('approved Academy board remains direct supplied flat chalkboard surface',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  const block=css.match(/\.stage \.presentation-surface\.presentation-chalkboard\{[\s\S]*?\}/)?.[0]||'';
  assert.ok(block,'chalkboard style block must exist');
  assert.match(block,/background-image:url\('assets\/academy-tafel-vorlage\.png'\)!important/);
  assert.match(block,/background-size:181\.739% auto!important/);
  assert.match(block,/background-position:left bottom!important/);
  assert.match(block,/mask-image:linear-gradient\(to right,#000 0%,#000 84%,transparent 100%\)!important/);
  assert.doesNotMatch(block,/academy-tafel-original-crop\.svg/);
  assert.doesNotMatch(block,/radial-gradient/);
  assert.doesNotMatch(block,/assets\/tafel-academy\.jpg/);
  assert.doesNotMatch(block,/perspective\(/);
  assert.doesNotMatch(block,/rotateY\(/);
});

test('fixed 40-second production keeps Room 3 and suppresses legacy background layers',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(js,/v169-fixed-test-active/);
  assert.match(css,/\.stage\.v169-fixed-test-active[\s\S]*?room3-academy\.jpg/);
  assert.match(css,/\.stage\.v169-fixed-test-active \.bgScene[\s\S]*?display:\s*none!important/);
});

test('medium Academy avatar uses the real 600x577 asset ratio and scales with the stage',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  const medium=css.match(/\.stage \.avatar\.medium\s*\{[\s\S]*?\n\}/);
  assert.ok(medium,'medium avatar rule missing');
  assert.match(medium[0],/height:\s*96%\s*!important/);
  assert.match(medium[0],/aspect-ratio:\s*600\s*\/\s*577/);
});

test('approved Bis Nabel avatar keeps one crop and defaults to the right',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  const medium=css.match(/\.stage \.avatar\.medium\s*\{[\s\S]*?\n\}/);
  assert.ok(medium,'medium avatar rule missing');
  assert.match(medium[0],/background-image:url\('assets\/testavatar-academy\.png'\)!important/);
  assert.match(medium[0],/background-position:center bottom!important/);
  assert.match(medium[0],/bottom:\s*-2%\s*!important/);
});

test('fixed Academy startup reapplies its clean stage after legacy local restore',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/function resetFixedAcademyStage\(doc\)/);
  assert.match(js,/resetFixedAcademyStage\(doc\)[\s\S]*?classList\.add\('medium'\)/);
});

test('preload hides stage before DOMContentLoaded and delayed reset is the only startup release',()=>{
  const preload=read('src/preload.js');
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(preload,/webFrame/);
  assert.match(css,/\.stage\{visibility:hidden!important\}/);
  assert.match(css,/\.stage\.academy-startup-ready\{visibility:visible!important\}/);
});

test('desktop window is not shown on ready-to-show before delayed scene restore settles',()=>{
  const main=read('src/main.js');
  assert.match(main,/did-finish-load/);
});
