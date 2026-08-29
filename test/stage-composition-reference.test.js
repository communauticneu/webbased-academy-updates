const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Academy stage uses temporary room 3',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.stage\.v1617-presentation-active[\s\S]*?background-image:\s*url\(['"]assets\/room3-academy\.jpg['"]\)!important/);
  assert.match(css,/\.stage\.v1617-presentation-active \.floor[\s\S]*?display:\s*none!important/);
});

test('Academy chalk surface uses direct original crop, stays flat and has no synthetic frame',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  const board=css.match(/\.stage \.presentation-surface\.presentation-chalkboard\{[\s\S]*?\}/)?.[0]||'';
  assert.match(board,/background-image:url\('assets\/academy-tafel-vorlage\.png'\)!important/);
  assert.match(board,/background-size:181\.739% 111\.891%!important/);
  assert.match(board,/background-position:left bottom!important/);
  assert.match(board,/border:\s*0!important/);
  assert.match(board,/box-shadow:\s*none!important/);
  assert.doesNotMatch(board,/academy-tafel-original-crop\.svg/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*?top:\s*-4%!important[\s\S]*?bottom:\s*0!important[\s\S]*?width:\s*68%!important[\s\S]*?height:\s*108%!important/);
  assert.match(css,/presentation-chalkboard\[data-position="left"\][\s\S]*?left:\s*-2%!important/);
  assert.doesNotMatch(css,/perspective\(/);
  assert.doesNotMatch(css,/rotateY\(/);
});

test('visible Academy board uses approved responsive navel avatar composition on the right',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.stage \.avatar\.medium[\s\S]*?height:\s*96%!important[\s\S]*?width:\s*auto!important[\s\S]*?aspect-ratio:\s*600\s*\/\s*577[\s\S]*?bottom:\s*-2%!important/);
  assert.match(css,/\.stage \.avatar\.medium[\s\S]*?background-image:\s*url\(['"]assets\/testavatar-academy\.png['"]\)!important/);
  const js=read('src/presentation-stage-v16.17.js');
  const fn=js.match(/function setAcademyBoardVisible\(doc,visible\)[\s\S]*?\n  }/);
  assert.ok(fn,'setAcademyBoardVisible missing');
  assert.match(fn[0],/classList\.add\('medium'\)/);
});

test('legacy brown board stays forbidden in the composed Academy stage',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.stage #boardOverlay\s*\{[\s\S]*?display:\s*none!important[\s\S]*?visibility:\s*hidden!important/);
});
