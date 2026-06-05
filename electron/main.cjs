const { app, BrowserWindow, ipcMain, dialog, nativeTheme, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "PromptVault",
    backgroundColor: '#070B14',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    show: false
  });

  // In production, load the built index.html
  // In development, load the vite dev server
  const startUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  win.loadURL(startUrl);

  win.once('ready-to-show', () => {
    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  // Temporarily hide native menu bar (File, Edit, View, Window)
  Menu.setApplicationMenu(null);

  // To restore the menus later, uncomment the following block and comment Menu.setApplicationMenu(null):
  /*
  const defaultMenu = Menu.buildFromTemplate([
    { label: 'File', submenu: [{ role: 'quit' }] },
    { label: 'Edit', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }] },
    { label: 'View', submenu: [{ role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }] },
    { label: 'Window', submenu: [{ role: 'minimize' }, { role: 'close' }] }
  ]);
  Menu.setApplicationMenu(defaultMenu);
  */

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Implementation for Storage & File Dialogs (Backend for v1)
ipcMain.handle('app:version', () => app.getVersion());

ipcMain.handle('theme:set', async (event, theme) => {
  nativeTheme.themeSource = theme;
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  if (win) {
    win.setBackgroundColor(theme === 'dark' ? '#070B14' : '#F8FAFC');
  }
  return true;
});

ipcMain.handle('storage:save', async (event, data) => {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'database.json');
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  return true;
});

ipcMain.handle('storage:load', async () => {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'database.json');
  if (fs.existsSync(dbPath)) {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
  return null;
});
