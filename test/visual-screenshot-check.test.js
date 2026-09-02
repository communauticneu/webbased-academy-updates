const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('visual guard captures a real Creator screenshot and checks approved Academy composition',()=>{
  const s=read('src/visual-check.js');
  assert.match(s,/capturePage\(/);
  assert.match(s,/academy-visual-latest\.png/);
  assert.match(s,/room3-academy\.jpg/);
  assert.match(s,/testavatar-academy\.png/);
  assert.match(s,/academyBoardObjectEditor/);
  assert.match(s,/aspect/);
  assert.match(s,/process\.exitCode\s*=\s*1/);
});

test('visual guard exercises Post-it editing with a real Chromium double-click',()=>{
  const s=read('src/visual-check.js');
  assert.match(s,/AcademyPostItSystem\.addPostIt/);
  assert.match(s,/sendInputEvent\(/);
  assert.match(s,/click\(2\)/);
  assert.match(s,/contentEditable==='true'/);
});

test('visual guard rejects Post-it text that grows beyond the stage',()=>{
  const s=read('src/visual-check.js');
  assert.match(s,/Post-it-Text laeuft ueber den Buehnenrand/);
  assert.match(s,/text\.scrollWidth<=text\.clientWidth/);
  assert.match(s,/paperRect\.right<=stageRect\.right/);
});

test('visual guard renders the approved Post-it control arrangement',()=>{
  const s=read('src/visual-check.js');
  assert.match(s,/Post-it-Funktionsleiste entspricht nicht dem Textrahmen-Design/);
  assert.match(s,/toolbarRect\.top>=paperRect\.bottom/);
  assert.match(s,/swatches\.length===6/);
  assert.match(s,/deleteStyle\.width==='22px'&&resizeStyle\.width==='22px'/);
});

test('test launcher runs unit tests then visual screenshot guard before normal Creator start',()=>{
  const pkg=JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['visual:check'],'electron src/visual-check.js');
  const cmd=read('ACADEMY-TEST.cmd');
  const unit=cmd.indexOf('npm.cmd test');
  const visual=cmd.indexOf('npm.cmd run visual:check');
  const start=cmd.indexOf('npm.cmd start');
  assert.ok(unit>=0 && visual>unit && start>visual,'expected unit tests -> visual guard -> Creator start');
});

test('generated screenshot is excluded from Git history',()=>{
  assert.match(read('.gitignore'),/academy-visual-latest\.png/);
});
