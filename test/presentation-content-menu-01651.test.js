'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const shell=fs.readFileSync(path.join(__dirname,'../src/presentation-content-shell.js'),'utf8');

test('frontend uses compact Medien heading and grouped content tabs',()=>{
  assert.match(shell,/textContent\?\.trim\(\)==='Präsentationsmedium'/,'internal presentation-medium lookup must stay unchanged');
  assert.match(shell,/>Medien</,'visible medium heading should be Medien');
  for(const label of ['Text','Post-it','Zeichen','Aufgabe','XXX','Import'])assert.match(shell,new RegExp('>'+label+'<'));
});

test('Text and Zeichen use the same one-open-submenu pattern',()=>{
  assert.match(shell,/data-content-tool="text"/);
  assert.match(shell,/data-content-tool="symbols"/);
  for(const label of ['Überschrift','Normal','Klein','Kreis','Pfeil','Linie'])assert.match(shell,new RegExp('>'+label+'<'));
  assert.match(shell,/menus\.forEach\(menu=>menu\.hidden=menu!==target\)/);
});

test('future content tabs are frontend placeholders without actions',()=>{
  for(const tool of ['postit','task','future','import'])assert.match(shell,new RegExp('data-content-tool="'+tool+'"'));
  assert.doesNotMatch(shell,/data-content-tool="(?:postit|task|future|import)"[^>]*data-action/);
});
