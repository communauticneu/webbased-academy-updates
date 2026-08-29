const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const preload=fs.readFileSync(path.join(__dirname,'../src/preload.js'),'utf8');

test('preload loads reusable presentation model and chalkboard editor after stage setup',()=>{
  const model=preload.indexOf("presentation-object-model.js");
  const editor=preload.indexOf("presentation-object-editor.js");
  const stage=preload.indexOf("presentation-stage-v16.17.js");
  assert.ok(model>stage,'presentation object model must load after stage setup');
  assert.ok(editor>model,'chalkboard editor must load after presentation object model');
});
