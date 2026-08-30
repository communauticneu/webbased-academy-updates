const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const editor=fs.readFileSync(path.join(__dirname,'../src/presentation-object-editor.js'),'utf8');

test('open text submenu uses a reusable softly blue submenu surface',()=>{
  assert.match(editor,/academy-submenu/,'submenu needs a reusable shared class for future submenus');
  assert.match(editor,/academy-submenu[^}]*background:rgba\(76,200,255,\.1[0-9]?\)/,'submenu surface should use a subtle light-blue tint');
  assert.match(editor,/academy-submenu[^}]*border:1px solid rgba\(76,200,255,\.4[0-9]?\)/,'submenu needs a clearly visible but restrained blue border');
});
