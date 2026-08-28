const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('V0.16.23 keeps the existing scene controls and gives the scene column a clear production layout',()=>{
  const html=read('src/index.html');

  assert.match(html,/\/\* V0\.16\.23 · Szenenleiste/);
  assert.match(html,/#vortragView > \.workspace\s*\{[^}]*grid-template-columns:\s*240px minmax\(0,1fr\) 430px!important/);

  for(const id of ['addScene','duplicateScene','deleteScene','moveUp','moveDown']){
    assert.match(html,new RegExp(`id=["']${id}["']`),`${id} must remain available`);
  }

  assert.match(html,/<div class="n">01<\/div><div class="t">Avatar-Einstieg<\/div>/);
  assert.match(html,/<div class="n">02<\/div><div class="t">Schultafel-Text<\/div>/);
  assert.match(html,/<div class="n">03<\/div><div class="t">Tafel \/ Grafik<\/div>/);
  assert.match(html,/<div class="n">04<\/div><div class="t">Avatar-Abschluss<\/div>/);
});

test('V0.16.23 does not remove the protected Academy production hooks',()=>{
  const html=read('src/index.html');
  for(const hook of ['v160Start','v160Pause','v160Reset','stage','boardOverlay','academyAutoUpdater']){
    assert.match(html,new RegExp(`id=["']${hook}["']`),`${hook} must remain available`);
  }
});
