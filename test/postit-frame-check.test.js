const test=require('node:test');
const assert=require('node:assert/strict');
const {keepsFixedFrameTracks}=require('../src/postit-frame-check.js');

test('Post-it frame check allows only the flexible middle tracks to resize',()=>{
  assert.equal(keepsFixedFrameTracks(
    '30px 258px 42px','28px 0px 30px',
    '30px 688px 42px','28px 362px 30px'
  ),true);
});

test('Post-it frame check rejects a resized outer edge or corner track',()=>{
  assert.equal(keepsFixedFrameTracks(
    '30px 258px 42px','28px 0px 30px',
    '31px 688px 42px','28px 362px 30px'
  ),false);
  assert.equal(keepsFixedFrameTracks(
    '30px 258px 42px','28px 0px 30px',
    '30px 688px 42px','28px 362px 31px'
  ),false);
});
