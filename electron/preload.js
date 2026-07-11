const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    isElectron: true,
    platform: process.platform,
    version: require('./package.json').version,
    openExternal: (url) => ipcRenderer.send('open-external', url),
    onGoogleAuthCallback: (callback) => {
        ipcRenderer.removeAllListeners('google-auth-callback');
        ipcRenderer.on('google-auth-callback', (event, data) => callback(data));
    }
});
