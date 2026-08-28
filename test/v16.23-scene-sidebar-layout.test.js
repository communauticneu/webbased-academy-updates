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
  const media=read('src/media-library-scene-picker.js');
  assert.match(media,/\/\* V0\.16\.23 · visuelle Medienbibliothek/);
  for(const label of ['3D Kompetenzmodell','Diagramm','Schultafel','Flipchart','Whiteboard','Academy Hintergrund','Importieren']) assert.match(media,new RegExp(label));
  assert.match(media,/grid-template-columns:repeat\(7,minmax\(140px,1fr\)\)/);
  assert.match(media,/height:118px!important/);
  assert.match(media,/object-fit:cover!important/);
  assert.match(media,/prepareVisualLibrary\(\)/);
});

test('V0.16.23 uses one coherent responsive layout instead of fixed widths that push the editor off-screen',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/\/\* V0\.16\.23 · einheitliches Responsive-Layout/);
  assert.match(js,/@media \(min-width:1251px\) and \(max-width:1599px\)/);
  assert.match(js,/grid-template-columns:200px minmax\(0,1fr\) 300px/);
  assert.match(js,/grid-template-areas:"scenes stage editor" "media media editor"/);
  assert.match(js,/@media \(max-width:1250px\)/);
  assert.match(js,/grid-template-columns:190px minmax\(0,1fr\)/);
  assert.match(js,/grid-template-areas:"scenes stage" "media media" "editor editor"/);
  assert.doesNotMatch(js,/min-width:1000px!important/);
  assert.doesNotMatch(js,/min-width:760px!important/);
});

test('V0.16.23 detaches its production columns from legacy workspace layout classes',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/workspace\.classList\.remove\('workspace'\)/);
  assert.match(js,/scenesCol\.classList\.remove\('scenecol'\)/);
  assert.match(js,/centerCol\.classList\.remove\('centercol'\)/);
  assert.match(js,/legacyControls\.classList\.remove\('controls'\)/);
});

test('V0.16.23 bounds the production workspace and stage on ultrawide displays',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/@media \(min-width:1600px\)/);
  assert.ok(js.includes('max-width:2000px!important'),'ultrawide workspace must be capped at 2000px');
  assert.ok(js.includes('margin:0 auto!important'),'ultrawide workspace must be centered');
  assert.ok(js.includes('aspect-ratio:16/9!important'),'stage must remain 16:9');
  assert.ok(js.includes('max-height:min(calc(100vh - 360px),760px)!important'),'stage must be bounded by available height');
});

test('V0.16.23 media tiles remain visual and readable at narrower widths',()=>{
  const media=read('src/media-library-scene-picker.js');
  assert.match(media,/\/\* V0\.16\.23 · responsive Medienkacheln/);
  assert.match(media,/@media \(max-width:1900px\)/);
  assert.match(media,/grid-template-columns:repeat\(4,minmax\(150px,1fr\)\)/);
  assert.match(media,/@media \(max-width:1250px\)/);
  assert.match(media,/grid-template-columns:repeat\(3,minmax\(140px,1fr\)\)/);
  assert.match(media,/height:110px!important/);
});

test('V0.16.23 keeps legacy test controls hidden across responsive layouts',()=>{
  const js=read('src/presentation-stage-v16.17.js');
  assert.match(js,/\.v1623-legacy-controls,.v1623-hidden-timeline\{display:none!important\}/);
  assert.match(js,/\.v1623-scene-editor\{grid-area:editor!important/);
  assert.match(js,/\.v1623-media-workspace\{grid-area:media!important/);
});

test('V0.16.23 does not remove the protected Academy production hooks',()=>{
  const html=read('src/index.html');
  for(const hook of ['v160Start','v160Pause','v160Reset','stage','boardOverlay','academyAutoUpdater']) assert.match(html,new RegExp(`id=["']${hook}["']`),`${hook} must remain available`);
});
