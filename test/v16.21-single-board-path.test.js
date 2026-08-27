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

test('approved Academy board remains the only visible chalkboard surface',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/presentation-surface\.presentation-chalkboard/);
  assert.match(css,/assets\/academy-tafel-vorlage\.png/);
});

test('fixed 40-second production keeps Room 3 and suppresses legacy background layers',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(js,/v169-fixed-test-active/);
  assert.match(css,/\.stage\.v169-fixed-test-active[\s\S]*?room3-academy\.jpg/);
  assert.match(css,/\.stage\.v169-fixed-test-active \.bgScene[\s\S]*?display:\s*none!important/);
  assert.match(css,/\.stage\.v169-fixed-test-active \.fullGraphic[\s\S]*?display:\s*none!important/);
  assert.match(css,/\.stage\.v169-fixed-test-active \.fullscreen-object[\s\S]*?display:\s*none!important/);
});

test('medium Academy avatar scales with the stage instead of fixed pixel sizes',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  const medium=css.match(/\.stage \.avatar\.medium\s*\{[\s\S]*?\n\}/);
  assert.ok(medium,'medium avatar rule missing');
  assert.match(medium[0],/height:\s*\d+(?:\.\d+)?%\s*!important/);
  assert.match(medium[0],/aspect-ratio:\s*450\s*\/\s*590/);
  assert.doesNotMatch(css,/@media[\s\S]*?\.avatar\.medium\{[^}]*height:\s*\d+px\s*!important/);
});

test('approved Bis Nabel avatar keeps one crop and defaults to the right',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  const medium=css.match(/\.stage \.avatar\.medium\s*\{[\s\S]*?\n\}/);
  assert.ok(medium,'medium avatar rule missing');
  assert.match(medium[0],/background-image:url\('assets\/testavatar-academy\.png'\)!important/);
  assert.match(medium[0],/background-position:center bottom!important/);
  assert.match(css,/\.stage\.v1617-presentation-active \.avatar\.medium\{[^}]*left:auto!important;[^}]*right:-2%!important/);
  assert.doesNotMatch(css,/:has\(\.presentation-surface\[data-position=/);
});
