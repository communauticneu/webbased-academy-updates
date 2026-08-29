const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const effects=fs.readFileSync(path.join(__dirname,'../src/presentation-object-effects.js'),'utf8');

test('chalk write effect reveals text progressively like writing, not as a simple fade',()=>{
  assert.match(effects,/@keyframes academy-write-in\{from\{[^}]*clip-path:inset\(0 100% 0 0\)[^}]*\}to\{[^}]*clip-path:inset\(0 0 0 0\)/,'write effect must reveal chalk text from left to right');
  assert.match(effects,/academy-effect-write\{animation:academy-write-in [^;}]*steps\(/,'write effect must use stepped progression to resemble chalk writing');
});
