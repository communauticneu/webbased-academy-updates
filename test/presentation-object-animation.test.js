const test=require('node:test');
const assert=require('node:assert/strict');
const animation=require('../src/presentation-object-animation');

const object=(overrides={})=>({id:'o1',type:'text',animation:{enter:'write',exit:'wipe'},timing:{start:2,enterDuration:2,end:8,exitDuration:1},...overrides});

test('object is hidden before its timeline start',()=>{
  assert.deepEqual(animation.stateAt(object(),1.9),{phase:'hidden',progress:0,effect:'write'});
});

test('write animation progresses during enter interval and then stays visible',()=>{
  assert.deepEqual(animation.stateAt(object(),3),{phase:'enter',progress:.5,effect:'write'});
  assert.deepEqual(animation.stateAt(object(),5),{phase:'visible',progress:1,effect:'none'});
});

test('wipe exit progresses at end and finishes hidden',()=>{
  assert.deepEqual(animation.stateAt(object(),8.5),{phase:'exit',progress:.5,effect:'wipe'});
  assert.deepEqual(animation.stateAt(object(),9.1),{phase:'hidden',progress:1,effect:'wipe'});
});

test('post-it unroll and fade remain supported by same timeline engine',()=>{
  const postit=object({type:'postit',animation:{enter:'unroll',exit:'fade'}});
  assert.equal(animation.stateAt(postit,3).effect,'unroll');
  assert.equal(animation.stateAt(postit,8.5).effect,'fade');
});

test('animation attributes expose phase effect and bounded progress for renderer',()=>{
  const attrs=animation.attributesFor(object(),3);
  assert.match(attrs,/data-animation-phase="enter"/);
  assert.match(attrs,/data-animation-effect="write"/);
  assert.match(attrs,/--academy-animation-progress:0.5/);
});
