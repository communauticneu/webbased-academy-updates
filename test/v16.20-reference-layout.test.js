const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('V0.16.20 Academy board follows approved left integrated reference',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/V0\.16\.20 APPROVED ACADEMY REFERENCE/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*width:\s*58%!important/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*height:\s*68%!important/);
  assert.match(css,/presentation-chalkboard\[data-position="left"\][\s\S]*left:\s*7%!important/);
  assert.doesNotMatch(css,/presentation-chalkboard[\s\S]{0,300}border:\s*[1-9]/);
});

test('V0.16.20 navel avatar is large and positioned right of board',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/V0\.16\.20 NAVEL AVATAR/);
  assert.match(css,/\.avatar\.medium[\s\S]*height:\s*220px!important/);
  assert.match(css,/\.avatar\.medium[\s\S]*transform:\s*scale\(1\.9\)!important/);
  assert.match(css,/:has\(\.presentation-surface\[data-position="left"\]\.is-visible\) \.avatar\.medium[\s\S]*right:\s*8%!important/);
});

test('V0.16.20 legacy floating board is never used while Academy presentation surface is active',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/#boardOverlay[\s\S]*display:\s*none!important/);
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/presentationSurface/);
});
