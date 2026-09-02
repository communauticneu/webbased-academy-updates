const {app,BrowserWindow}=require('electron');
const fs=require('node:fs');
const path=require('node:path');

const ROOT=path.join(__dirname,'..');
const SCREENSHOT=path.join(ROOT,'academy-visual-latest.png');
const WAIT_MS=2200;

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function inspectCreator(win){
  return win.webContents.executeJavaScript(`(()=>{
    const rect=selector=>{
      const el=document.querySelector(selector); if(!el)return null;
      const r=el.getBoundingClientRect(); const c=getComputedStyle(el);
      return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,display:c.display,visibility:c.visibility,opacity:Number(c.opacity||1)};
    };
    const stage=document.querySelector('.stage');
    const avatar=document.getElementById('avatar');
    const stageRect=rect('.stage');
    const stageStyle=stage?getComputedStyle(stage):null;
    const avatarStyle=avatar?getComputedStyle(avatar):null;
    return {
      viewport:{width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight},
      stage:stageRect,
      stageVisibility:stageStyle?.visibility||'',
      stageBackground:stageStyle?.backgroundImage||'',
      stageClasses:stage?.className||'',
      avatar:rect('#avatar'),
      avatarBackground:avatarStyle?.backgroundImage||'',
      avatarClasses:avatar?.className||'',
      sidebar:rect('.sidebar'),
      editor:rect('#academyBoardObjectEditor'),
      media:rect('.v1623-media-workspace'),
      sceneList:rect('#sceneList'),
      aspect:stageRect&&stageRect.height?stageRect.width/stageRect.height:0
    };
  })()`,true);
}

async function checkPostItDoubleClick(win){
  const point=await win.webContents.executeJavaScript(`(()=>{
    if(!globalThis.AcademyPostItSystem?.addPostIt)return null;
    globalThis.AcademyPostItSystem.addPostIt({content:'Doppelklick-Test',x:110,y:110});
    const text=document.querySelector('.academy-postit-text');
    if(!text)return null;
    const r=text.getBoundingClientRect();
    return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)};
  })()`,true);
  if(!point)return false;
  const click=clickCount=>{
    win.webContents.sendInputEvent({type:'mouseDown',x:point.x,y:point.y,button:'left',clickCount});
    win.webContents.sendInputEvent({type:'mouseUp',x:point.x,y:point.y,button:'left',clickCount});
  };
  click(1);
  await sleep(80);
  click(2);
  await sleep(120);
  return win.webContents.executeJavaScript(`(()=>{
    const text=document.querySelector('.academy-postit-text');
    return !!text&&text.contentEditable==='true';
  })()`,true);
}

async function checkPostItGrowth(win){
  const entered=await win.webContents.executeJavaScript(`(()=>{
    const text=document.querySelector('.academy-postit-text');
    if(!text||text.contentEditable!=='true')return false;
    text.textContent='SehrLangerPostItText'.repeat(80);
    text.dispatchEvent(new Event('input',{bubbles:true}));
    return true;
  })()`,true);
  if(!entered)return false;
  await sleep(120);
  return win.webContents.executeJavaScript(`(()=>{
    const stage=document.querySelector('.stage'),paper=document.querySelector('.academy-postit-paper'),text=document.querySelector('.academy-postit-text');
    if(!stage||!paper||!text)return false;
    const stageRect=stage.getBoundingClientRect(),paperRect=paper.getBoundingClientRect();
    return paperRect.right<=stageRect.right+1&&text.scrollWidth<=text.clientWidth+1&&paperRect.height>58;
  })()`,true);
}

function validate(s,postItEditing,postItGrowth){
  const errors=[];
  const visible=r=>!!r&&r.display!=='none'&&r.visibility!=='hidden'&&r.opacity>0&&r.width>0&&r.height>0;
  if(!visible(s.stage))errors.push('Buehne ist nicht sichtbar.');
  if(Math.abs((s.aspect||0)-(16/9))>.06)errors.push(`Buehne ist nicht 16:9 (Ist: ${(s.aspect||0).toFixed(3)}).`);
  if(s.stageVisibility!=='visible')errors.push(`Buehnen-Sichtbarkeit ist ${s.stageVisibility||'unbekannt'}.`);
  if(!String(s.stageBackground).includes('room3-academy.jpg'))errors.push('Academy Raum 3 fehlt im gerenderten Hintergrund.');
  if(!visible(s.avatar))errors.push('Avatar ist im Startbild nicht sichtbar.');
  if(!String(s.avatarBackground).includes('testavatar-academy.png'))errors.push('Freigegebener Academy-Testavatar fehlt.');
  if(String(s.avatarClasses).includes('hidden'))errors.push('Avatar ist unerwartet ausgeblendet.');
  if(!visible(s.sidebar)||s.sidebar.width<180)errors.push('Hauptnavigation ist nicht korrekt sichtbar.');
  if(!visible(s.sceneList))errors.push('Szenenleiste ist nicht sichtbar.');
  if(!visible(s.media))errors.push('Medienbibliothek ist nicht sichtbar.');
  if(!visible(s.editor))errors.push('Tafel-Editor ist nicht sichtbar.');
  if(s.editor&&s.editor.right>s.viewport.width+2)errors.push('Tafel-Editor ragt rechts aus dem sichtbaren Bereich.');
  if(s.media&&s.media.bottom>s.viewport.height+8)errors.push('Medienbibliothek ragt unten aus dem sichtbaren Bereich.');
  if(s.viewport.scrollWidth>s.viewport.width+4)errors.push('Unerwartetes horizontales Scrollen erkannt.');
  if(!postItEditing)errors.push('Post-it-Text wird durch einen echten Doppelklick nicht bearbeitbar.');
  if(!postItGrowth)errors.push('Post-it-Text laeuft ueber den Buehnenrand.');
  return errors;
}

app.whenReady().then(async()=>{
  let win;
  try{
    win=new BrowserWindow({
      width:1600,
      height:1000,
      show:false,
      backgroundColor:'#071018',
      webPreferences:{
        preload:path.join(__dirname,'preload.js'),
        contextIsolation:true,
        nodeIntegration:false
      }
    });
    await win.loadFile(path.join(__dirname,'index.html'));
    await sleep(WAIT_MS);
    const postItEditing=await checkPostItDoubleClick(win);
    const postItGrowth=await checkPostItGrowth(win);
    const state=await inspectCreator(win);
    const image=await win.webContents.capturePage();
    fs.writeFileSync(SCREENSHOT,image.toPNG());
    const errors=validate(state,postItEditing,postItGrowth);
    console.log(`Visueller Screenshot: ${SCREENSHOT}`);
    if(errors.length){
      console.error('VISUAL CHECK FEHLER:');
      errors.forEach(error=>console.error(` - ${error}`));
      process.exitCode = 1;
      win.destroy();
      app.exit(1);
      return;
    }
    console.log('VISUAL CHECK GREEN: Raum, Avatar, 16:9-Buehne, Navigation, Szenen, Medienbibliothek und Tafel-Editor sind sichtbar und innerhalb des Testfensters.');
    win.destroy();
    app.exit(0);
  }catch(error){
    console.error('VISUAL CHECK konnte nicht ausgefuehrt werden:',error?.stack||error);
    process.exitCode = 1;
    try{win?.destroy();}catch{}
    app.exit(1);
  }
});
