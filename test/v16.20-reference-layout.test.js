const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Academy board remains a framed left object with room context visible',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*width:\s*52%!important/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*height:\s*68%!important/);
  assert.match(css,/presentation-chalkboard\[data-position="left"\][\s\S]*left:\s*8%!important/);
  assert.match(css,/presentation-surface\.presentation-chalkboard[\s\S]*border:\s*7px solid #51483f!important/);
});

test('current navel avatar is realistic, large and positioned right of framed board',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/\.avatar\.medium[\s\S]*background-image:\s*url\(['"]assets\/testavatar-academy\.png['"]\)!important/);
  assert.match(css,/:has\(\.presentation-surface\[data-position="left"\]\.is-visible\) \.avatar\.medium[\s\S]*right:\s*1\.5%!important/);
  assert.match(css,/\.avatar\.medium[\s\S]*height:\s*470px!important[\s\S]*width:\s*360px!important/);
});

test('legacy floating board is never used while Academy presentation surface is active',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/#boardOverlay[\s\S]*display:\s*none!important/);
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/presentationSurface/);
});
