const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ready: () => {
        console.log('Relay ready');
        ipcRenderer.send('ready');
    },

    onUpdater: (fn) => {
        ipcRenderer.on('updater', (event, ...args) => fn(...args));
    },
    updateCheck: () => {
        ipcRenderer.send('updateCheck');
    },

    errorMsg: (fn) => {
        ipcRenderer.on('errorMsg', (event, ...args) => fn(...args));
    },

    openWeb: (url) => {
        ipcRenderer.send('openWeb', url);
    },
    openDirectory: () => {
        ipcRenderer.send('openDirectory');
    },
    gotDirectory: (fn) => {
        ipcRenderer.on('gotDirectory', (event, ...args) => fn(...args));
    },

    attemptCreate: (record) => {
        ipcRenderer.send('attemptCreate', record);
    },
    resultCreate: (fn) => {
        ipcRenderer.on('resultCreate', (event, ...args) => fn(...args));
    }
});
