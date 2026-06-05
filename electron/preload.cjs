const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('PromptVault', {
  app: {
    getVersion: () => ipcRenderer.invoke('app:version')
  },
  storage: {
    load: () => ipcRenderer.invoke('storage:load'),
    save: (data) => ipcRenderer.invoke('storage:save', data),
    backup: () => ipcRenderer.invoke('storage:backup'),
    restore: () => ipcRenderer.invoke('storage:restore')
  },
  files: {
    importPrompts: () => ipcRenderer.invoke('files:import'),
    exportPrompts: (format) => ipcRenderer.invoke('files:export', format),
    selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory')
  },
  theme: {
    setTheme: (theme) => ipcRenderer.invoke('theme:set', theme)
  },
  updater: {
    onUpdateDownloaded: (callback) => {
      const listener = () => callback();
      ipcRenderer.on('updater:downloaded', listener);
      return () => {
        ipcRenderer.removeListener('updater:downloaded', listener);
      };
    },
    relaunch: () => ipcRenderer.send('updater:relaunch')
  }
});
