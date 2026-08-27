const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Academy chalk surface is a large frameless perspective presentation plane',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/presentation-surface\.presentation-chalkboard[\s\S]*?border:\s*0!important/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*?top:\s*5%!important[\s\S]*?width:\s*67%!important[\s\S]*?height:\s*90%!important/);
  assert.match(css,/presentation-chalkboard\[data-position="left"\][\s\S]*?left:\s*-1%!important/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*?transform:\s*perspective\(1200px\) rotateY\(2deg\)!important/);
});

test('visible Academy board uses approved realistic navel avatar composition on the right',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.avatar\.medium[\s\S]*?background-image:\s*url\(['"]assets\/testavatar-academy\.png['"]\)!important/);
  assert.match(css,/\.avatar\.medium[\s\S]*?height:\s*470px!important[\s\S]*?width:\s*360px!important[\s\S]*?bottom:\s*-7%!important/);
  assert.match(css,/\.avatar\.medium\s*>\s*\*[\s\S]*?display:\s*none!important/);
  assert.match(css,/:has\(\.presentation-surface\[data-position="left"\]\.is-visible\) \.avatar\.medium[\s\S]*?right:\s*1\.5%!important/);
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
