const test=require('node:test');
const assert=require('node:assert/strict');

const fresh=()=>{
  delete require.cache[require.resolve('../src/presentation-object-model')];
  return require('../src/presentation-object-model');
};

test('presentation object keeps board content independent from its visual style',()=>{
  const {normalizePresentationObject}=fresh();
  const object=normalizePresentationObject({
    type:'text',
    content:'Kognitive Kompetenz',
    x:18,
    y:24,
    width:42,
    height:12,
    rotation:0,
    enter:'write',
    exit:'wipe',
    start:3.5,
    enterDuration:1.2,
    end:14,
    exitDuration:.8
  });
  assert.equal(object.type,'text');
  assert.equal(object.content,'Kognitive Kompetenz');
  assert.deepEqual(object.frame,{x:18,y:24,width:42,height:12,rotation:0});
  assert.deepEqual(object.timing,{start:3.5,enterDuration:1.2,end:14,exitDuration:.8});
  assert.deepEqual(object.animation,{enter:'write',exit:'wipe'});
});

test('presentation object model is reusable for board whiteboard pinwall and future 3D displays',()=>{
  const {normalizeDisplay}=fresh();
  for(const option of ['chalkboard','whiteboard','pinwall','3d']){
    const display=normalizeDisplay({option,objects:[{type:'graphic',assetId:'asset-1'}]});
    assert.equal(display.option,option);
    assert.equal(display.objects.length,1);
    assert.equal(display.objects[0].assetId,'asset-1');
  }
});

test('display supports room, emphasized and fullscreen staging with independent avatar visibility',()=>{
  const {normalizeDisplay}=fresh();
  const display=normalizeDisplay({option:'chalkboard',stageMode:'fullscreen',avatarVisible:false,depth:'behind-avatar'});
  assert.equal(display.stageMode,'fullscreen');
  assert.equal(display.avatarVisible,false);
  assert.equal(display.depth,'behind-avatar');
});

test('older or invalid object values receive safe defaults',()=>{
  const {normalizePresentationObject,normalizeDisplay}=fresh();
  const object=normalizePresentationObject({type:'unknown',x:-100,width:500,start:-4,end:-9,enter:'boom',exit:'boom'});
  assert.equal(object.type,'text');
  assert.ok(object.frame.x>=0);
  assert.ok(object.frame.width<=100);
  assert.ok(object.timing.start>=0);
  assert.ok(object.timing.end>=object.timing.start);
  assert.equal(object.animation.enter,'fade');
  assert.equal(object.animation.exit,'fade');
  const display=normalizeDisplay({option:'unknown',stageMode:'unknown',depth:'unknown'});
  assert.equal(display.option,'chalkboard');
  assert.equal(display.stageMode,'room');
  assert.equal(display.depth,'stage');
});
