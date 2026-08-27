const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Academy chalkboard keeps room context and a balanced left composition',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*?top:\s*7%!important[\s\S]*?width:\s*61%!important[\s\S]*?height:\s*86%!important/);
  assert.match(css,/presentation-chalkboard\[data-position="left"\][\s\S]*?left:\s*4%!important/);
  assert.match(css,/presentation-surface\.presentation-chalkboard[\s\S]*?box-shadow:\s*none!important/);
});

test('visible Academy board uses the realistic navel test avatar on the right',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.avatar\.medium[\s\S]*?background-image:\s*url\(['"]assets\/testavatar-academy\.png['"]\)!important/);
  assert.match(css,/\.avatar\.medium[\s\S]*?height:\s*390px!important[\s\S]*?width:\s*300px!important/);
  assert.match(css,/\.avatar\.medium\s*>\s*\*[\s\S]*?display:\s*none!important/);
  assert.match(css,/:has\(\.presentation-surface\[data-position="left"\]\.is-visible\) \.avatar\.medium[\s\S]*?right:\s*3%!important[\s\S]*?bottom:\s*-2%!important/);
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
