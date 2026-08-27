const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Academy board remains left integrated in the current composed stage',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*width:\s*66%!important/);
  assert.match(css,/presentation-chalkboard\[data-size="large"\][\s\S]*height:\s*100%!important/);
  assert.match(css,/presentation-chalkboard\[data-position="left"\][\s\S]*left:\s*0%!important/);
  assert.doesNotMatch(css,/presentation-chalkboard[\s\S]{0,300}border:\s*[1-9]/);
});

test('current navel avatar is large and positioned right of integrated board',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/:has\(\.presentation-surface\[data-position="left"\]\.is-visible\) \.avatar\.medium[\s\S]*right:\s*4%!important/);
  assert.match(css,/:has\(\.presentation-surface\[data-position="left"\]\.is-visible\) \.avatar\.medium[\s\S]*height:\s*74%!important/);
});

test('legacy floating board is never used while Academy presentation surface is active',()=>{
  const css=read('src/presentation-stage-v16.17.css');
  assert.match(css,/#boardOverlay[\s\S]*display:\s*none!important/);
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/presentationSurface/);
});
