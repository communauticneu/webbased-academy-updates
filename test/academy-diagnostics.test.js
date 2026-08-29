const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const cmd=fs.readFileSync(path.join(root,'ACADEMY-TEST.cmd'),'utf8');

test('test launcher writes a local sanitized diagnostic status',()=>{
  assert.match(cmd,/academy-diagnostics\.txt/i);
  assert.match(cmd,/package\.json/i);
  assert.match(cmd,/git rev-parse --short HEAD/i);
  assert.match(cmd,/TEST_STATUS=/i);
  assert.doesNotMatch(cmd,/git remote -v/i);
  assert.doesNotMatch(cmd,/set\s*>/i);
});

test('launcher fetches the canonical development branch directly and resets to FETCH_HEAD',()=>{
  assert.match(cmd,/https:\/\/github\.com\/communauticneu\/webbased-academy-updates\.git/i);
  assert.match(cmd,/git fetch --no-tags .*dev-stage-composition/i);
  assert.match(cmd,/git reset --hard FETCH_HEAD/i);
});

test('diagnostics publishing is isolated from the development branch',()=>{
  assert.match(cmd,/academy-diagnostics/i);
  assert.match(cmd,/git push origin HEAD:academy-diagnostics/i);
  assert.doesNotMatch(cmd,/git push origin dev-stage-composition/i);
  assert.doesNotMatch(cmd,/git add \.\s*$/im);
});

test('failed tests publish a sanitized tail without machine paths',()=>{
  assert.match(cmd,/TEST_LOG=academy-test-output\.txt/i);
  assert.match(cmd,/Fehlerdetails Tests:/i);
  assert.match(cmd,/Get-Content -LiteralPath '%TEST_LOG%'\s*\^\|\s*Select-Object -Last 80/i);
  assert.match(cmd,/USERPROFILE/i);
  assert.match(cmd,/<USER>/i);
  assert.match(cmd,/<PROJECT>/i);
  assert.doesNotMatch(cmd,/type\s+"?%TEST_LOG%"?\s*>>\s*"?%DIAG_FILE%"?/i);
});

test('visual failure diagnostics always include a sanitized tail of the visual log',()=>{
  assert.match(cmd,/VISUAL_LOG=academy-visual-output\.txt/i);
  assert.match(cmd,/visual:check\s*>"%VISUAL_LOG%"\s*2>&1/i);
  assert.match(cmd,/Fehlerdetails Visual:/i);
  assert.match(cmd,/Get-Content -LiteralPath '%VISUAL_LOG%'\s*\^\|\s*Select-Object -Last 40/i);
});
