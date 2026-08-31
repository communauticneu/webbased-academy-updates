const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const src=name=>fs.readFileSync(path.join(__dirname,'..','src',name),'utf8');

test('preload no longer starts legacy text runtime',()=>{
  const preload=src('preload.js');
  for(const legacy of ['presentation-text-direct-ux.js','presentation-object-stage-interaction.js','presentation-textarea-v16.24.js','academy-fonts.css','loadAcademyFonts','startTextRuntimeProbe']){
    assert.equal(preload.includes(legacy),false,`legacy text runtime remains: ${legacy}`);
  }
});

test('text shell preserves controls but creates no board text objects',()=>{
  const editor=src('presentation-object-editor.js');
  for(const label of ['Text &amp; Zeichen','✎ Text','▰ Post-it','➜ Pfeil','◯ Kreis','╱ Linie','Überschrift','Normal','Klein'])assert.equal(editor.includes(label),true,`missing visible control: ${label}`);
  for(const legacy of ['academyBoardObjectLayer','contentEditable','MutationObserver','createTextDraft','boardObjectMarkup','font-family','FontFace'])assert.equal(editor.includes(legacy),false,`legacy text implementation remains: ${legacy}`);
});
