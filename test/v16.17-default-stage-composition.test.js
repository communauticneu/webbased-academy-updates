const test=require('node:test');
const assert=require('node:assert/strict');

function fresh(){
  delete require.cache[require.resolve('../src/free-presentation')];
  return require('../src/free-presentation');
}

test('board scenes default to board left and avatar foreground right composition',()=>{
  const {normalizeScene}=fresh();
  assert.equal(normalizeScene({kind:'board'}).mediumPosition,'left');
});

test('explicit scene positions remain freely selectable',()=>{
  const {normalizeScene}=fresh();
  assert.equal(normalizeScene({kind:'board',mediumPosition:'right'}).mediumPosition,'right');
  assert.equal(normalizeScene({kind:'board',mediumPosition:'center'}).mediumPosition,'center');
});
