import { ipcMain } from 'electron';
import { getSettings, updateSettings } from '../database';

export const setupSettingsHandlers = (): void => {
  // Get all settings
  ipcMain.handle('settings:get', async () => {
    const settings = await getSettings();
    return settings;
  });

  // Update settings
  ipcMain.handle('settings:update', async (_event, newSettings: Record<string, any>) => {
    await updateSettings(newSettings);
    return newSettings;
  });
};
