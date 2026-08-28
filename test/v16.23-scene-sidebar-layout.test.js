const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('V0.16.23 keeps the existing scene controls and gives the scene column a clear production layout',()=>{
  const html=read('src/index.html');
  const js=read('src/presentation-stage-v16.17.js');

  assert.match(js,/\/\* V0\.16\.23 · Szenenleiste/);
  assert.match(js,/#vortragView > \.workspace\{grid-template-columns:240px minmax\(0,1fr\) 430px!important\}/);
  assert.match(js,/const labels=\['Avatar-Einstieg','Schultafel-Text','Tafel \/ Grafik','Avatar-Abschluss'\]/);
  assert.match(js,/prepareSceneSidebarV1623\(doc\)/);

  for(const id of ['addScene','duplicateScene','deleteScene','moveUp','moveDown']){
    assert.match(html,new RegExp(`id=["']${id}["']`),`${id} must remain available`);
  }
});

test('V0.16.23 does not remove the protected Academy production hooks',()=>{
  const html=read('src/index.html');
  for(const hook of ['v160Start','v160Pause','v160Reset','stage','boardOverlay','academyAutoUpdater']){
    assert.match(html,new RegExp(`id=["']${hook}["']`),`${hook} must remain available`);
  }
});
