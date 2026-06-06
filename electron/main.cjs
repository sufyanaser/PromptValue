const { app, BrowserWindow, ipcMain, dialog, nativeTheme, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');
const { GoogleGenAI } = require('@google/genai');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

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
    if (process.env.ELECTRON_DEVTOOLS === '1') {
      win.webContents.openDevTools();
    }
    
    // Check for updates if app is packaged (production build)
    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify().catch((err) => {
        console.error('[Updater] Initial check failed:', err);
      });
    }
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

ipcMain.handle('ai:generate', async (event, { prompt, systemInstruction, apiKey, provider = 'gemini', model }) => {
  try {
    if (provider === 'gemini') {
      const finalApiKey = apiKey || process.env.GEMINI_API_KEY;
      if (!finalApiKey) throw new Error("Gemini API Key is required.");

      const ai = new GoogleGenAI({ 
        apiKey: finalApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const response = await ai.models.generateContent({
        model: model || "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are a helpful prompt engineering assistant.",
        },
      });

      return { text: response.text };
    }

    if (provider === 'openai' || provider === 'copilot') {
      const finalApiKey = apiKey || process.env.OPENAI_API_KEY;
      if (!finalApiKey) throw new Error("OpenAI API Key is required.");

      const openai = new OpenAI({ apiKey: finalApiKey });
      const response = await openai.chat.completions.create({
        model: model || (provider === 'copilot' ? "gpt-4o" : "gpt-3.5-turbo"),
        messages: [
          { role: "system", content: systemInstruction || "You are a helpful prompt engineering assistant." },
          { role: "user", content: prompt }
        ],
      });

      return { text: response.choices[0].message?.content || "" };
    }

    if (provider === 'claude') {
      const finalApiKey = apiKey || process.env.ANTHROPIC_API_KEY;
      if (!finalApiKey) throw new Error("Anthropic API Key is required.");

      const anthropic = new Anthropic({ apiKey: finalApiKey });
      const response = await anthropic.messages.create({
        model: model || "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: systemInstruction || "You are a helpful prompt engineering assistant.",
        messages: [{ role: "user", content: prompt }],
      });

      return { text: response.content[0].text };
    }

    throw new Error("Unsupported provider");
  } catch (error) {
    console.error("AI Generation Error in Main Process:", error);
    return { error: error.message || "Failed to generate content" };
  }
});

ipcMain.handle('dialog:selectDirectory', async () => {
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'اختر مجلد قاعدة البيانات'
  });
  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
});

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
  
  // 1. Always save to default location as reference/fallback
  const defaultDbPath = path.join(userDataPath, 'database.json');
  fs.writeFileSync(defaultDbPath, JSON.stringify(data, null, 2));
  
  // 2. Save to custom directory if specified
  if (data && data.settings && data.settings.databasePath) {
    const customDir = data.settings.databasePath;
    if (customDir !== './database' && customDir !== '') {
      try {
        if (!fs.existsSync(customDir)) {
          fs.mkdirSync(customDir, { recursive: true });
        }
        const customDbPath = path.join(customDir, 'database.json');
        fs.writeFileSync(customDbPath, JSON.stringify(data, null, 2));
      } catch (err) {
        console.error('[Electron] Failed to save to custom path:', err);
      }
    }
  }
  return true;
});

ipcMain.handle('storage:load', async () => {
  const userDataPath = app.getPath('userData');
  const defaultDbPath = path.join(userDataPath, 'database.json');
  
  if (!fs.existsSync(defaultDbPath)) {
    return null;
  }
  
  try {
    const defaultData = JSON.parse(fs.readFileSync(defaultDbPath, 'utf8'));
    
    // Check if custom path is set and loaded
    if (defaultData && defaultData.settings && defaultData.settings.databasePath) {
      const customDir = defaultData.settings.databasePath;
      if (customDir !== './database' && customDir !== '') {
        const customDbPath = path.join(customDir, 'database.json');
        if (fs.existsSync(customDbPath)) {
          try {
            return JSON.parse(fs.readFileSync(customDbPath, 'utf8'));
          } catch (err) {
            console.error('[Electron] Failed to read from custom path, falling back:', err);
          }
        }
      }
    }
    
    return defaultData;
  } catch (err) {
    console.error('[Electron] Failed to load database:', err);
    return null;
  }
});

// Configure Auto-Updater
autoUpdater.autoDownload = true;

autoUpdater.on('checking-for-update', () => {
  console.log('[Updater] Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('[Updater] Update available:', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('[Updater] Update not available:', info);
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`[Updater] Download progress: ${progressObj.percent}%`);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('[Updater] Update downloaded:', info);
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    win.webContents.send('updater:downloaded');
  }
});

autoUpdater.on('error', (err) => {
  console.error('[Updater] Error checking/downloading update:', err);
});

// Handle relaunch request from renderer
ipcMain.on('updater:relaunch', () => {
  autoUpdater.quitAndInstall();
});
