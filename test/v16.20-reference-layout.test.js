const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Academy chalk surface remains room-height, frameless and left integrated',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*width:\s*68%!important/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*height:\s*108%!important/);
  assert.match(css,/presentation-chalkboard\[data-position="left"\][\s\S]*left:\s*-2%!important/);
  assert.match(css,/presentation-surface\.presentation-chalkboard[\s\S]*border:\s*0!important/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*transform:\s*perspective\(900px\) rotateY\(3\.5deg\)!important/);
});

test('current navel avatar is realistic, large and positioned right of chalk surface',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.avatar\.medium[\s\S]*background-image:\s*url\(['"]assets\/testavatar-academy\.png['"]\)!important/);
  assert.match(css,/:has\(\.presentation-surface\[data-position="left"\]\.is-visible\) \.avatar\.medium[\s\S]*right:\s*-2%!important/);
  assert.match(css,/\.avatar\.medium[\s\S]*height:\s*590px!important[\s\S]*width:\s*450px!important/);
});

test('legacy floating board is never used while Academy presentation surface is active',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/#boardOverlay[\s\S]*display:\s*none!important/);
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/presentationSurface/);
});
