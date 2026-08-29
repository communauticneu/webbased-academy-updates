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
