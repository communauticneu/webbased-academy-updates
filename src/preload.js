const { contextBridge, ipcRenderer, webFrame } = require('electron');

// Frühester Startschutz: noch bevor DOMContentLoaded und die alte HTML-Bühne sichtbar werden können.
webFrame.insertCSS('.stage{visibility:hidden!important}.stage.academy-startup-ready{visibility:visible!important}');

// V0.16.23 · Hauptmenü sichtbar halten: globale Creator-Navigation bleibt unabhängig von älteren Responsive-Regeln erhalten.
webFrame.insertCSS('.app{display:grid!important;grid-template-columns:230px minmax(0,1fr)!important}.app > .sidebar{display:block!important;visibility:visible!important;width:230px!important;min-width:230px!important;max-width:230px!important}');

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

// Renderer-Erweiterungen werden erst nach fertigem DOM geladen.
window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'presentation-stage-v16.17.css';
  document.head.appendChild(style);

  const stageScript = document.createElement('script');
  stageScript.src = 'presentation-stage-v16.17.js';
  stageScript.onload = () => {
    const objectModelScript = document.createElement('script');
    objectModelScript.src = 'presentation-object-model.js';
    objectModelScript.onload = () => {
      const objectEditorScript = document.createElement('script');
      objectEditorScript.src = 'presentation-object-editor.js';
      document.documentElement.appendChild(objectEditorScript);
    };
    document.documentElement.appendChild(objectModelScript);

    const mediaPickerScript = document.createElement('script');
    mediaPickerScript.src = 'media-library-scene-picker.js';
    mediaPickerScript.onload = () => {
      const responsiveHeightScript = document.createElement('script');
      responsiveHeightScript.src = 'responsive-height-v16.23.js';
      document.documentElement.appendChild(responsiveHeightScript);
    };
    document.documentElement.appendChild(mediaPickerScript);
  };
  document.documentElement.appendChild(stageScript);
});