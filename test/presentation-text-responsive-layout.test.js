const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');

const TextSystem=require(path.join(__dirname,'..','src','presentation-text-system.js'));

test('reprojects text position when the stage size changes',()=>{
 const projected=TextSystem.projectPositionForResize({x:720,y:270},{width:960,height:540},{width:480,height:270});
 assert.deepEqual(projected,{x:360,y:135});
});

test('clamps a text box so its full width stays inside the stage',()=>{
 const clamped=TextSystem.clampTextPosition({x:360,y:40},{width:180,height:48},{width:480,height:270});
 assert.deepEqual(clamped,{x:300,y:40});
});

test('responsive correction does not alter font profiles',()=>{
 assert.equal(TextSystem.MEDIUM_PROFILES.none.sizes.heading,42);
 assert.equal(TextSystem.MEDIUM_PROFILES.board.sizes.heading,39);
 assert.equal(TextSystem.MEDIUM_PROFILES.none.fonts.heading,'Arial');
 assert.equal(TextSystem.MEDIUM_PROFILES.board.fonts.heading,'KG Second Chances Sketch');
});
