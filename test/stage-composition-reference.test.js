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

test('Academy chalk surface is room-height, frameless and slightly perspective',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/presentation-surface\.presentation-chalkboard[\s\S]*?border:\s*0!important/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*?top:\s*-4%!important[\s\S]*?bottom:\s*0!important[\s\S]*?width:\s*68%!important[\s\S]*?height:\s*108%!important/);
  assert.match(css,/presentation-chalkboard\[data-position="left"\][\s\S]*?left:\s*-2%!important/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*?transform:\s*perspective\(900px\) rotateY\(3\.5deg\)!important/);
});

test('visible Academy board uses approved realistic navel avatar composition on the right',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.avatar\.medium[\s\S]*?background-image:\s*url\(['"]assets\/testavatar-academy\.png['"]\)!important/);
  assert.match(css,/\.avatar\.medium[\s\S]*?height:\s*590px!important[\s\S]*?width:\s*450px!important[\s\S]*?bottom:\s*-18%!important/);
  assert.match(css,/\.avatar\.medium\s*>\s*\*[\s\S]*?display:\s*none!important/);
  assert.match(css,/:has\(\.presentation-surface\[data-position="left"\]\.is-visible\) \.avatar\.medium[\s\S]*?right:\s*-2%!important/);
  const js=read('src/presentation-stage-v16.17.js');
  const fn=js.match(/function setAcademyBoardVisible\(doc,visible\)[\s\S]*?\n  }/);
  assert.ok(fn,'setAcademyBoardVisible missing');
  assert.match(fn[0],/getElementById\('avatar'\)/);
  assert.match(fn[0],/classList\.remove\('hidden'\)/);
  assert.match(fn[0],/classList\.add\('medium'\)/);
});

test('legacy brown board stays forbidden in the composed Academy stage',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.stage #boardOverlay\s*\{[\s\S]*?display:\s*none!important[\s\S]*?visibility:\s*hidden!important/);
});
