const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const js=fs.readFileSync(path.join(__dirname,'..','src','presentation-stage-v16.17.js'),'utf8');

test('V0.16.23 measures the real remaining viewport height instead of relying only on a fixed calc offset',()=>{
  assert.match(js,/function syncProductionWorkspaceHeightV1623\(doc\)/);
  assert.match(js,/getBoundingClientRect\(\)\.top/);
  assert.match(js,/innerHeight/);
  assert.match(js,/vortrag\.style\.height=/);
  assert.match(js,/addEventListener\('resize'/);
});
