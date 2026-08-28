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
  assert.match(js,/const labels=\['Avatar-Einstieg','Schultafel-Text','Tafel \/ Grafik','Avatar-Abschluss'\]/);
  assert.match(js,/prepareSceneSidebarV1623\(doc\)/);
  for(const id of ['addScene','duplicateScene','deleteScene','moveUp','moveDown']) assert.match(html,new RegExp(`id=["']${id}["']`),`${id} must remain available`);
});

test('V0.16.23 implements the approved four-area production workspace',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/\/\* V0\.16\.23 · freigegebene Produktionsoberfläche/);
  assert.match(js,/className='v1623-scene-editor'/);
  assert.match(js,/title\.textContent='Szene bearbeiten'/);
  assert.match(js,/className='v1623-stage-controls'/);
  assert.match(js,/media\.classList\.add\('v1623-media-workspace'\)/);
  assert.match(js,/grid-template-columns:240px minmax\(0,1fr\) 430px/);
  assert.match(js,/grid-template-areas:"scenes stage editor" "media media editor"/);
  assert.match(js,/sceneCount\.textContent=`\$\{scenes\.length\} Szenen`/);
});

test('V0.16.23 protects the global creator navigation while restructuring Vortrag',()=>{
  const html=read('src/index.html');
  const preload=read('src/preload.js');
  for(const label of ['Intro / Outro','Vortrag','Skripten','Cartoons','Coaching','Feedback','Podcast']) assert.match(html,new RegExp(label.replace(' / ',' \/ ')),`${label} must remain in the global navigation`);
  assert.match(preload,/\/\/ V0\.16\.23 · Hauptmenü sichtbar halten/);
  assert.match(preload,/\.app\{display:grid!important;grid-template-columns:230px minmax\(0,1fr\)!important/);
  assert.match(preload,/\.app > \.sidebar\{display:block!important;visibility:visible!important;width:230px!important;min-width:230px!important/);
});

test('V0.16.23 media library follows the approved visual tile reference',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/\/\* V0\.16\.23 · visuelle Medienbibliothek/);
  assert.match(js,/3D Kompetenzmodell/);
  assert.match(js,/Diagramm/);
  assert.match(js,/Schultafel/);
  assert.match(js,/Flipchart/);
  assert.match(js,/Whiteboard/);
  assert.match(js,/Academy Hintergrund/);
  assert.match(js,/Importieren/);
  assert.match(js,/grid-template-columns:repeat\(7,minmax\(140px,1fr\)\)/);
  assert.match(js,/height:118px!important/);
  assert.match(js,/object-fit:cover!important/);
});

test('V0.16.23 does not remove the protected Academy production hooks',()=>{
  const html=read('src/index.html');
  for(const hook of ['v160Start','v160Pause','v160Reset','stage','boardOverlay','academyAutoUpdater']) assert.match(html,new RegExp(`id=["']${hook}["']`),`${hook} must remain available`);
});
