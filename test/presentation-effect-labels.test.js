const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

test('presentation effect labels distinguish enter from exit fade',()=>{
 const source=fs.readFileSync(path.join(__dirname,'..','src','free-presentation.js'),'utf8');
 const enter="id=\"ftMediumEnter\"><option value=\"cut\">Direkt</option><option value=\"fade\">Einblenden</option>";
 const exit="id=\"ftMediumExit\"><option value=\"cut\">Direkt</option><option value=\"fade\">Ausblenden</option>";
 assert.ok(source.includes(enter));
 assert.ok(source.includes(exit));
});
