const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('academyDesktop', {
  isDesktop: true,
  getAppVersion: () => ipcRenderer.invoke('academy-app-version'),
  checkUpdate: () => ipcRenderer.invoke('academy-update-check'),
  diagnoseUpdate: () => ipcRenderer.invoke('academy-update-diagnose'),
  downloadUpdate: () => ipcRenderer.invoke('academy-update-download'),
  installUpdate: () => ipcRenderer.invoke('academy-update-install'),
  projectDir: () => ipcRenderer.invoke('academy-project-dir'),
  heygenKeyState: () => ipcRenderer.invoke('heygen-key-state'),
  heygenSaveApiKey: key => ipcRenderer.invoke('heygen-save-api-key', key),
  heygenListOptions: () => ipcRenderer.invoke('heygen-list-options'),
  heygenGenerateTest: input => ipcRenderer.invoke('heygen-generate-test', input),
  onHeygenStatus: callback => ipcRenderer.on('heygen-test-status', (_event, data) => callback(data)),
  onUpdate: callback => ipcRenderer.on('academy-update', (_event, data) => callback(data))
});
