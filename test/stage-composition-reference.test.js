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

test('visible Academy board composes with an unclipped navel avatar on the right',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.avatar\.medium[\s\S]*?height:\s*300px!important[\s\S]*?width:\s*120px!important[\s\S]*?transform:\s*scale\(1\.25\)!important/);
  assert.match(css,/:has\(\.presentation-surface\[data-position="left"\]\.is-visible\) \.avatar\.medium[\s\S]*?right:\s*7%!important[\s\S]*?bottom:\s*-4%!important/);
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
