const test=require('node:test');
const assert=require('node:assert/strict');
const effects=require('../src/presentation-object-effects');

test('visible effect mapping matches board object vocabulary',()=>{
  assert.equal(effects.enterEffectForType('text'),'write');
  assert.equal(effects.enterEffectForType('postit'),'unroll');
  assert.equal(effects.enterEffectForType('arrow'),'draw');
  assert.equal(effects.enterEffectForType('circle'),'draw');
  assert.equal(effects.enterEffectForType('line'),'draw');
  assert.equal(effects.enterEffectForType('graphic'),'fade');
});

test('effect styles contain visible write unroll draw and wipe animations',()=>{
  const css=effects.effectStyles();
  assert.match(css,/@keyframes academy-write-in/);
  assert.match(css,/@keyframes academy-unroll-in/);
  assert.match(css,/@keyframes academy-draw-in/);
  assert.match(css,/@keyframes academy-wipe-out/);
  assert.match(css,/clip-path/);
  assert.match(css,/transform-origin:left center/);
});

test('preview control remains compact and does not add a new editor row',()=>{
  assert.match(effects.previewButtonMarkup(),/data-board-preview/);
  assert.match(effects.previewButtonMarkup(),/>Effekt testen</);
});
