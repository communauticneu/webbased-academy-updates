const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    backgroundColor: '#06131c',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.maximize();
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
