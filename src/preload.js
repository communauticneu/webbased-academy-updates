const { contextBridge, ipcRenderer, webFrame } = require('electron');

webFrame.insertCSS('.stage{visibility:hidden!important}.stage.academy-startup-ready{visibility:visible!important}');
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

function appendScript(src,onload){const script=document.createElement('script');script.src=src;if(onload)script.onload=onload;document.documentElement.appendChild(script);}
function startPresentationExtensions(){
  appendScript('presentation-text-startup-reset.js',()=>{
    const style=document.createElement('link');style.rel='stylesheet';style.href='presentation-stage-v16.17.css';document.head.appendChild(style);
    appendScript('presentation-stage-v16.17.js',()=>{
      appendScript('obsolete-background-controls.js');
      appendScript('presentation-medium-selection.js');
      appendScript('presentation-text-system.js',()=>{
        appendScript('presentation-text-layout-sync.js');
        appendScript('presentation-text-miniature.js');
        appendScript('presentation-content-shell.js');
      });
      appendScript('media-library-scene-picker.js',()=>appendScript('responsive-height-v16.23.js'));
    });
  });
}
window.addEventListener('DOMContentLoaded',startPresentationExtensions);
