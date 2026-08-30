const { app, BrowserWindow, ipcMain, dialog, safeStorage } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const heygen = require('./heygen-service');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#06131c',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.maximize();
  win.webContents.once('did-finish-load', () => {
    setTimeout(async () => {
      if (!win || win.isDestroyed()) return;
      try {
        const diagnostic = await win.webContents.executeJavaScript(`(() => {
          const surface=document.getElementById('presentationSurface');
          const text=document.querySelector('.academy-board-object-text');
          const fontLink=Array.from(document.styleSheets).find(s=>String(s.href||'').includes('academy-fonts.css'));
          return {
            href:location.href,
            fontStylesheet:fontLink?.href||null,
            fontCheck:document.fonts.check('24px "KG Second Chances Sketch"'),
            surfaceClass:surface?.className||null,
            surfaceMedium:surface?.dataset?.medium||null,
            textExists:!!text,
            textClass:text?.className||null,
            computedFont:text?getComputedStyle(text).fontFamily:null
          };
        })()`);
        console.log('ACADEMY FONT DIAG '+JSON.stringify(diagnostic));
      } catch (error) {
        console.log('ACADEMY FONT DIAG ERROR '+String(error?.message||error));
      }
      win.show();
    }, 1200);
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(err => {
      win?.webContents.send('academy-update', { state:'error', message: err?.message || String(err) });
    });
  }, 2500);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on('checking-for-update', () => {
  win?.webContents.send('academy-update', { state:'checking' });
});
autoUpdater.on('update-not-available', () => {
  win?.webContents.send('academy-update', { state:'not-available' });
});
autoUpdater.on('update-available', info => {
  win?.webContents.send('academy-update', { state:'available', version:info.version });
});
autoUpdater.on('download-progress', p => {
  win?.webContents.send('academy-update', { state:'downloading', percent:Math.round(p.percent) });
});
autoUpdater.on('update-downloaded', info => {
  win?.webContents.send('academy-update', { state:'ready', version:info.version });
});
autoUpdater.on('error', err => {
  win?.webContents.send('academy-update', { state:'error', message:err.message || 'GitHub Update-Server nicht erreichbar' });
});

ipcMain.handle('academy-update-download', async () => {
  try {
    const result = await autoUpdater.downloadUpdate();
    return { ok: true, result };
  } catch (err) {
    console.error('academy-update-download failed:', err);
    throw err;
  }
});

ipcMain.handle('academy-update-install', () => autoUpdater.quitAndInstall(false, true));
ipcMain.handle('academy-update-check', () => autoUpdater.checkForUpdates());
ipcMain.handle('academy-app-version', () => app.getVersion());
ipcMain.handle('academy-update-diagnose', async () => {
  const result = await autoUpdater.checkForUpdates();
  const info = result?.updateInfo || {};
  return {
    localVersion: app.getVersion(),
    remoteVersion: info.version || '(keine)',
    files: (info.files || []).map(f => ({url:f.url, sha512:f.sha512 || ''})),
    releaseName: info.releaseName || '',
    packaged: app.isPackaged
  };
});

ipcMain.handle('academy-project-dir', () => {
  const dir = path.join(app.getPath('documents'), 'Webbased Academy Creator', 'Projekte');
  fs.mkdirSync(dir, { recursive:true });
  return dir;
});


// V0.16.12 – abgegrenzte HeyGen-Testintegration. Keine automatische Videoerzeugung.
function heygenKeyFile(){ return path.join(app.getPath('userData'),'heygen-api-key.bin'); }
function saveHeygenKey(key){
  if(!safeStorage.isEncryptionAvailable()) throw new Error('Sichere lokale Schlüsselspeicherung ist auf diesem System nicht verfügbar.');
  const value=String(key||'').trim(); if(!value) throw new Error('Bitte einen HeyGen-API-Schlüssel eingeben.');
  fs.writeFileSync(heygenKeyFile(),safeStorage.encryptString(value)); return true;
}
function loadHeygenKey(){
  const f=heygenKeyFile(); if(!fs.existsSync(f)) return '';
  if(!safeStorage.isEncryptionAvailable()) return '';
  try{return safeStorage.decryptString(fs.readFileSync(f))}catch{return ''}
}
ipcMain.handle('heygen-key-state',()=>({saved:!!loadHeygenKey()}));
ipcMain.handle('heygen-save-api-key',(_e,key)=>{saveHeygenKey(key);return {ok:true}});
ipcMain.handle('heygen-list-options',async()=>{
  const apiKey=loadHeygenKey(); if(!apiKey) throw new Error('HeyGen-API-Schlüssel fehlt. Bitte zuerst lokal speichern.');
  const [avatars,voices]=await Promise.all([heygen.listAvatars(apiKey),heygen.listVoices(apiKey)]);
  return {avatars:avatars.map(a=>({id:a.avatar_id,name:a.avatar_name||a.name||a.avatar_id})),voices:voices.map(v=>({id:v.voice_id,name:v.name||v.display_name||v.voice_id}))};
});
ipcMain.handle('heygen-generate-test',async(_e,input)=>{
  const apiKey=loadHeygenKey();
  const videoId=await heygen.generateAvatarVideo({apiKey,avatarId:input?.avatarId,voiceId:input?.voiceId,text:input?.text});
  win?.webContents.send('heygen-test-status',{state:'submitted',text:'Video wird erzeugt'});
  const result=await heygen.pollVideoStatus({apiKey,videoId,onStatus:status=>win?.webContents.send('heygen-test-status',{state:status,text:['pending','waiting','processing'].includes(status)?'Video wird erzeugt':'Avatar-Test bereit'})});
  win?.webContents.send('heygen-test-status',{state:'loading',text:'Video wird geladen'});
  const res=await fetch(result.videoUrl); if(!res.ok) throw new Error('Das fertige HeyGen-Video konnte nicht geladen werden.');
  const dir=path.join(app.getPath('userData'),'heygen-cache'); fs.mkdirSync(dir,{recursive:true});
  const file=path.join(dir,`avatar-test-${videoId}.mp4`); fs.writeFileSync(file,Buffer.from(await res.arrayBuffer()));
  return {ok:true,videoId,videoUrl:pathToFileURL(file).href};
});