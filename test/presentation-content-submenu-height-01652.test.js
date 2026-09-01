'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const shell=fs.readFileSync(path.join(__dirname,'../src/presentation-content-shell.js'),'utf8');

test('text and symbol submenu buttons share one fixed height',()=>{
  assert.match(shell,/\.academy-content-submenu button\{[^}]*height:36px/,'all submenu buttons must share the taller symbol-tab height');
  assert.doesNotMatch(shell,/\.academy-text-kind-menu button\{[^}]*height:/,'text submenu must not own a different height');
  assert.doesNotMatch(shell,/\.academy-symbol-kind-menu button\{[^}]*height:/,'symbol submenu must not own a different height');
});
