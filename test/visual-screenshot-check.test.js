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
