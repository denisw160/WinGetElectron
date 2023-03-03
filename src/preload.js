// preload.js
// noinspection JSUnresolvedFunction

// The preload script runs before.
// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {contextBridge, ipcRenderer} = require('electron');

// Register API
contextBridge.exposeInMainWorld('electronAPI', {
    doSearch: (query) => ipcRenderer.invoke('do-search', query)
});
