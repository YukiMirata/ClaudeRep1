import { BrowserWindow, screen } from 'electron';
import path from 'path';

export const createWindow = (): BrowserWindow => {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const window = new BrowserWindow({
    width: Math.min(1400, Math.floor(screenWidth * 0.8)),
    height: Math.min(900, Math.floor(screenHeight * 0.85)),
    minWidth: 1000,
    minHeight: 700,

    // Window styling
    backgroundColor: '#0f172a',

    // Frame options
    frame: true,
    titleBarStyle: 'default',

    // Always on top - CRITICAL for Windows 11
    alwaysOnTop: true,

    // Window behavior
    skipTaskbar: false,
    hasShadow: true,

    // Web preferences
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // CRITICAL: Re-assert always-on-top on blur for Windows 11
  // This ensures the window stays on top even when losing focus
  window.on('blur', () => {
    // Only re-assert if it was supposed to be on top
    if (window.isAlwaysOnTop()) {
      window.setAlwaysOnTop(true, 'floating');
    }
  });

  // Re-assert on focus as well
  window.on('focus', () => {
    if (window.isAlwaysOnTop()) {
      window.setAlwaysOnTop(true, 'floating');
    }
  });

  // Center the window
  window.center();

  return window;
};
