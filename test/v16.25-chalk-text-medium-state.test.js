const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'..','src','presentation-text-direct-ux.js'),'utf8');
test('neutral text layer mirrors chalkboard state before applying board typography',()=>{
 assert.match(src,/layer\.classList\.toggle\('academy-medium-chalkboard',chalk\)/);
 assert.match(src,/\.academy-medium-chalkboard \.academy-board-object-text\.academy-text-normal/);
 assert.match(src,/font-family:\"Academy DJB Chalk\"!important/);
});
test('font readiness does not resize established text frames',()=>{
 assert.match(src,/doc\.fonts\?\.ready\?\.then\(\(\)=>syncFont\(\)\)/);
 assert.doesNotMatch(src,/doc\.fonts\?\.ready[^;]*syncFrame/);
});
