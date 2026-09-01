const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'..','src','presentation-text-system.js'),'utf8');

test('drag follows pointer delta through engine pixels and normalizes only on pointerup',()=>{
 assert.match(src,/const current=engine\.getObject\(node\.dataset\.textId\);if\(!current\)return;/);
 assert.match(src,/engine\.moveSelected\(nextLeft-current\.x,nextTop-current\.y\);/);
 assert.doesNotMatch(src,/const currentLeft=nodeRect\.left-surfaceRect\.left,currentTop=nodeRect\.top-surfaceRect\.top;/);
 assert.match(src,/const up=\(\)=>\{const current=engine\.getObject\(node\.dataset\.textId\);/);
 assert.match(src,/engine\.setLayoutPosition\(node\.dataset\.textId,current\.x,current\.y,ratio\.xRatio,ratio\.yRatio\)/);
});
