import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { createWindow } from './window';
import { initDatabase } from './database';
import { EventScheduler } from './scheduler';
import { setupEventHandlers } from './ipc/events';
import { setupSettingsHandlers } from './ipc/settings';

// Note: electron-squirrel-startup is not needed for development
// If you need it for production builds, add it as an ES module

let mainWindow: BrowserWindow | null = null;
let scheduler: EventScheduler | null = null;

const createApp = async () => {
  // Initialize database
  await initDatabase();

  // Set up IPC handlers
  setupEventHandlers();
  setupSettingsHandlers();

  // Create the browser window
  mainWindow = createWindow();

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Initialize event scheduler
  scheduler = new EventScheduler(mainWindow);
  scheduler.start();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// This method will be called when Electron has finished initialization
app.whenReady().then(createApp);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (scheduler) {
      scheduler.stop();
    }
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createApp();
  }
});

// Handle IPC messages
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('toggle-always-on-top', (_event, enabled: boolean) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(enabled, 'floating');
    return enabled;
  }
  return false;
});

ipcMain.handle('get-always-on-top', () => {
  if (mainWindow) {
    return mainWindow.isAlwaysOnTop();
  }
  return false;
});
