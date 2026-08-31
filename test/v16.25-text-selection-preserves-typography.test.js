const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'..','src','presentation-text-direct-ux.js'),'utf8');

test('selecting an existing text object does not reapply or replace its typography',()=>{
  const match=src.match(/const activate=node=>\{([\s\S]*?)\};\n layer\.addEventListener\('pointerdown'/);
  assert.ok(match,'local text activation handler must exist');
  const body=match[1];
  assert.doesNotMatch(body,/syncFont\s*\(/);
  assert.doesNotMatch(body,/syncFrame\s*\(/);
  assert.doesNotMatch(body,/decorate\s*\(/);
});

test('selection-only DOM mutations do not trigger typography decoration',()=>{
  assert.match(src,/const isSelectionOnlyMutation=/);
  assert.match(src,/if\(records\.every\(isSelectionOnlyMutation\)\)return;/);
});
