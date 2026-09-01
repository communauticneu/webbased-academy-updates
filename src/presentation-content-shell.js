(function(root){
'use strict';
function install(doc){
 const legacyButton=doc?.querySelector?.('.v1623-edit-content'),host=legacyButton?.parentElement;if(!host)return false;
 const body=host.parentElement,mediumSection=Array.from(body?.querySelectorAll?.('.v1623-section')||[]).find(s=>s.querySelector('strong')?.textContent?.trim()==='Präsentationsmedium');
 host.innerHTML='<section id="academyBoardObjectEditor" class="academy-board-object-editor" aria-label="Text und Zeichen"><div class="academy-board-editor-head"><strong>Text &amp; Zeichen</strong></div><div id="academyBoardObjectToolbar" class="academy-board-object-toolbar"><button type="button" data-content-tool="text" aria-expanded="false">✎ Text</button><button type="button" data-content-tool="postit" aria-expanded="false">▰ Post-it</button><button type="button" data-content-tool="symbols" aria-expanded="false">Zeichen</button><button type="button" data-content-tool="task" aria-expanded="false">Aufgabe</button><button type="button" data-content-tool="future" aria-expanded="false">XXX</button><button type="button" data-content-tool="import" aria-expanded="false">Import</button></div><div class="academy-content-submenu academy-text-kind-menu" data-content-menu="text" data-text-kind-menu hidden><button type="button" data-text-kind="heading">Überschrift</button><button type="button" data-text-kind="normal">Normal</button><button type="button" data-text-kind="small">Klein</button></div><div class="academy-content-submenu academy-symbol-kind-menu" data-content-menu="symbols" hidden><button type="button">Kreis</button><button type="button">Pfeil</button><button type="button">Linie</button></div></section>';
 if(mediumSection&&body){body.insertBefore(host,mediumSection);const heading=mediumSection.querySelector('strong');if(heading)heading.textContent='Medien';}
 if(mediumSection&&!doc.getElementById('academyGraphicsSection'))mediumSection.insertAdjacentHTML('afterend','<section id="academyGraphicsSection" class="v1623-section academy-board-graphics-section"><strong>Grafiken</strong><button type="button" class="academy-board-graphics-open">▧ Grafiken öffnen</button></section>');
 const style=doc.createElement('style');style.id='academyContentShellStyle';style.textContent='.academy-board-object-editor{display:grid;gap:7px;padding:0;border:0;background:transparent}.academy-board-editor-head{display:flex;justify-content:space-between;gap:8px;align-items:baseline}.academy-board-object-toolbar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.academy-board-object-toolbar button,.academy-content-submenu button,.academy-board-graphics-open{min-height:29px;border:1px solid rgba(255,255,255,.14);border-radius:7px;background:rgba(255,255,255,.06);color:inherit;cursor:pointer;padding:4px 6px}.academy-content-submenu{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;padding:5px;border:1px solid rgba(76,200,255,.25);border-radius:8px;background:rgba(5,18,27,.72)}.academy-content-submenu[hidden]{display:none!important}.academy-content-submenu button{background:#155075;color:#eef6fb;border-color:#2a7ca8;border-radius:10px}.academy-content-submenu button:hover{background:#1d618b}.academy-board-graphics-open{width:100%;text-align:left;margin-top:5px}';doc.head?.appendChild(style);
 const tools=Array.from(host.querySelectorAll('[data-content-tool]')),menus=Array.from(host.querySelectorAll('[data-content-menu]'));
 tools.forEach(tool=>tool.addEventListener('click',()=>{
   const target=host.querySelector('[data-content-menu="'+tool.dataset.contentTool+'"]');
   if(!target){menus.forEach(menu=>menu.hidden=true);tools.forEach(item=>item.setAttribute('aria-expanded','false'));return;}
   const open=target.hidden;
   menus.forEach(menu=>menu.hidden=menu!==target);
   target.hidden=!open;
   tools.forEach(item=>item.setAttribute('aria-expanded',item===tool&&open?'true':'false'));
 }));
 const textMenu=host.querySelector('[data-text-kind-menu]'),textTool=host.querySelector('[data-content-tool="text"]');
 textMenu?.addEventListener('click',event=>{const button=event.target.closest?.('[data-text-kind]');if(!button)return;root.AcademyTextSystem?.addText?.(button.dataset.textKind);textMenu.hidden=true;textTool?.setAttribute('aria-expanded','false');});
 return true;
}
root.AcademyPresentationContentShell={install};if(root.document){const boot=()=>install(root.document)||setTimeout(()=>install(root.document),60);if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis!=='undefined'?globalThis:this);
