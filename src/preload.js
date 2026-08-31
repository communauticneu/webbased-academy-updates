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

function reportChalkFontRuntime(){
  const baseTitle=String(document.title||'Webbased Academy Creator').replace(/ · FONT:[^·]+(?: · TEXT:[^·]+)?$/,'');
  const loaded=document.fonts.check('24px "Academy KG Sketch"')&&document.fonts.check('24px "Academy DJB Chalk"');
  document.title=`${baseTitle} · FONT:${loaded?'OK':'FEHLER'}`;
  document.documentElement.dataset.kgFontRuntime=loaded?'ok':'error';
}

function reportTextRuntime(){
  const baseTitle=String(document.title||'Webbased Academy Creator').replace(/ · FONT:[^·]+(?: · TEXT:[^·]+)?$/,'');
  const loaded=document.fonts.check('24px "Academy KG Sketch"')&&document.fonts.check('24px "Academy DJB Chalk"');
  const node=document.querySelector('.academy-board-object-text.academy-text-normal');
  const span=node?.querySelector('span');
  if(!node||!span){
    document.title=`${baseTitle} · FONT:${loaded?'OK':'FEHLER'} · TEXT:WARTET`;
    return;
  }
  const cs=getComputedStyle(span);
  const rect=span.getBoundingClientRect();
  const lineHeight=parseFloat(cs.lineHeight)||0;
  const lines=lineHeight?Math.max(1,Math.round(rect.height/lineHeight)):0;
  const family=String(cs.fontFamily||'').replace(/["']/g,'').split(',')[0].trim();
  document.title=`${baseTitle} · FONT:${loaded?'OK':'FEHLER'} · TEXT:${family}|${cs.fontSize}|${lines}Z`;
}

function startTextRuntimeProbe(){
  let count=0;
  const timer=setInterval(()=>{
    reportTextRuntime();
    count+=1;
    if(count>=120)clearInterval(timer);
  },500);
}

function startPresentationExtensions(){
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'presentation-stage-v16.17.css';
  document.head.appendChild(style);

  const stageScript = document.createElement('script');
  stageScript.src = 'presentation-stage-v16.17.js';
  stageScript.onload = () => {
    const obsoleteBackgroundScript = document.createElement('script');
    obsoleteBackgroundScript.src = 'obsolete-background-controls.js';
    document.documentElement.appendChild(obsoleteBackgroundScript);

    const mediumSelectionScript = document.createElement('script');
    mediumSelectionScript.src = 'presentation-medium-selection.js';
    document.documentElement.appendChild(mediumSelectionScript);

    const objectModelScript = document.createElement('script');
    objectModelScript.src = 'presentation-object-model.js';
    objectModelScript.onload = () => {
      const animationScript = document.createElement('script');
      animationScript.src = 'presentation-object-animation.js';
      animationScript.onload = () => {
        const objectEditorScript = document.createElement('script');
        objectEditorScript.src = 'presentation-object-editor.js';
        objectEditorScript.onload = () => {
          const directTextUxScript = document.createElement('script');
          directTextUxScript.src = 'presentation-text-direct-ux.js';
          directTextUxScript.onload = () => {
            startTextRuntimeProbe();
            const stageInteractionScript = document.createElement('script');
            stageInteractionScript.src = 'presentation-object-stage-interaction.js';
            document.documentElement.appendChild(stageInteractionScript);
          };
          document.documentElement.appendChild(directTextUxScript);

          const textareaScript = document.createElement('script');
          textareaScript.src = 'presentation-textarea-v16.24.js';
          document.documentElement.appendChild(textareaScript);

          const objectEffectsScript = document.createElement('script');
          objectEffectsScript.src = 'presentation-object-effects.js';
          document.documentElement.appendChild(objectEffectsScript);
        };
        document.documentElement.appendChild(objectEditorScript);
      };
      document.documentElement.appendChild(animationScript);
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
}

// Renderer-Erweiterungen starten erst, wenn beide gebündelten Tafelschriften wirklich geladen sind.
window.addEventListener('DOMContentLoaded', () => {
  const fontStyle = document.createElement('link');
  fontStyle.rel = 'stylesheet';
  fontStyle.href = 'academy-fonts.css';
  fontStyle.addEventListener('load',()=>{
    Promise.all([
      document.fonts.load('24px "Academy KG Sketch"'),
      document.fonts.load('24px "Academy DJB Chalk"')
    ]).then(()=>{
      reportChalkFontRuntime();
      startPresentationExtensions();
    }).catch(()=>{
      reportChalkFontRuntime();
      startPresentationExtensions();
    });
  },{once:true});
  fontStyle.addEventListener('error',()=>{
    reportChalkFontRuntime();
    startPresentationExtensions();
  },{once:true});
  document.head.appendChild(fontStyle);
});