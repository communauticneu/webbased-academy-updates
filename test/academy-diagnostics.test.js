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

test('diagnostics publishing is isolated from the development branch',()=>{
  assert.match(cmd,/academy-diagnostics/i);
  assert.match(cmd,/git push origin HEAD:academy-diagnostics/i);
  assert.doesNotMatch(cmd,/git push origin dev-stage-composition/i);
  assert.doesNotMatch(cmd,/git add \.\s*$/im);
});

test('failed tests publish a compact sanitized assertion summary without machine paths',()=>{
  assert.match(cmd,/TEST_LOG=academy-test-output\.txt/i);
  assert.match(cmd,/Fehlerdetails:/i);
  assert.match(cmd,/not ok\|error:\|code:\|expected:\|actual:\|operator:/i);
  assert.match(cmd,/USERPROFILE/i);
  assert.match(cmd,/<USER>/i);
  assert.match(cmd,/<PROJECT>/i);
  assert.doesNotMatch(cmd,/type\s+"?%TEST_LOG%"?\s*>>\s*"?%DIAG_FILE%"?/i);
});
