const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname,'..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');

test('V0.16.15 is the package version',()=>{
  assert.equal(JSON.parse(read('package.json')).version,'0.16.15');
});

test('media picker module replaces manual medium id/path entry with library selection',()=>{
  const js=read('src/media-library-scene-picker.js');
  assert.match(js,/replaceMediumInputs/);
  assert.match(js,/document\.querySelectorAll\('#mediaGrid \.media-item'/);
  assert.match(js,/select\.id='fpMedium'/);
  assert.match(js,/urlInput\.type='hidden'/);
});

test('imported image media is converted to durable data URL instead of blob URL',()=>{
  const js=read('src/media-library-scene-picker.js');
  assert.match(js,/new FileReader\(\)/);
  assert.match(js,/reader\.readAsDataURL\(file\)/);
  assert.match(js,/item\.dataset\.url=dataUrl/);
  assert.doesNotMatch(js,/createObjectURL\(file\)/);
});

test('selected medium writes its durable source before existing scene save handler runs',()=>{
  const js=read('src/media-library-scene-picker.js');
  assert.match(js,/fpApply/);
  assert.match(js,/addEventListener\('click',syncSelectedMedium,true\)/);
  assert.match(js,/urlInput\.value=option\?\.dataset\.url\|\|''/);
});

test('saved scene media is restored as a selectable saved-library entry after restart',()=>{
  const js=read('src/media-library-scene-picker.js');
  assert.match(js,/window\.__freePresentationScenes/);
  assert.match(js,/Gespeichertes Medium/);
  assert.match(js,/scene\?\.mediumUrl/);
});

test('preload loads the media picker after renderer DOM is ready',()=>{
  const preload=read('src/preload.js');
  assert.match(preload,/media-library-scene-picker\.js/);
  assert.match(preload,/DOMContentLoaded/);
});

test('existing free presentation persistence remains unchanged',()=>{
  const html=read('src/index.html');
  assert.match(html,/presentationScenes:window\.__freePresentationScenes\?\.\(\)\|\|\[\]/);
  assert.match(html,/localStorage\.setItem\(V15_STORAGE_KEY/);
  assert.match(html,/window\.__freePresentationLoad\?\.\(d\)/);
});
