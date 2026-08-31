const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=name=>fs.readFileSync(path.join(__dirname,'..','src',name),'utf8');

test('preload starts no legacy text runtime',()=>{
 const preload=src('preload.js');
 for(const legacy of ['presentation-text-direct-ux.js','presentation-object-stage-interaction.js','presentation-textarea-v16.24.js','presentation-object-editor.js','presentation-object-model.js','presentation-object-animation.js','presentation-object-effects.js','academy-fonts.css','loadAcademyFonts','startTextRuntimeProbe'])assert.equal(preload.includes(legacy),false,`legacy runtime remains: ${legacy}`);
 assert.equal(preload.includes('presentation-content-shell.js'),true);
});

test('content shell preserves controls but generates no text objects',()=>{
 const shell=src('presentation-content-shell.js');
 for(const label of ['Text &amp; Zeichen','✎ Text','▰ Post-it','➜ Pfeil','◯ Kreis','╱ Linie','Überschrift','Normal','Klein'])assert.equal(shell.includes(label),true,`missing visible control: ${label}`);
 for(const legacy of ['academyBoardObjectLayer','contentEditable','MutationObserver','createTextDraft','boardObjectMarkup','font-family','FontFace'])assert.equal(shell.includes(legacy),false,`legacy text implementation remains: ${legacy}`);
});

test('legacy text implementation files are removed',()=>{
 for(const name of ['academy-fonts.css','presentation-text-direct-ux.js','presentation-textarea-v16.24.js','presentation-object-stage-interaction.js','presentation-object-editor.js','presentation-object-model.js','presentation-object-animation.js','presentation-object-effects.js'])assert.equal(fs.existsSync(path.join(__dirname,'..','src',name)),false,`legacy file remains: ${name}`);
});
