const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ux=fs.readFileSync(path.join(__dirname,'../src/presentation-text-direct-ux.js'),'utf8');

test('open text submenu uses a reusable softly blue submenu surface',()=>{
  assert.match(ux,/\.academy-submenu,/,'text submenu styling must share a reusable submenu class for future submenus');
  assert.match(ux,/background:rgba\(76,200,255,\.12\)!important/,'submenu surface should use a subtle light-blue tint');
  assert.match(ux,/border:1px solid rgba\(76,200,255,\.42\)!important/,'submenu needs a clearly visible but restrained blue border');
});
