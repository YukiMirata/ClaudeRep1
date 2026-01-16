import { ipcMain } from 'electron';
import { getDatabase } from '../database';

export const setupSettingsHandlers = (): void => {
  // Get all settings
  ipcMain.handle('settings:get', () => {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM settings').all() as Array<{ key: string; value: string }>;

    const settings: Record<string, any> = {};
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    }

    return settings;
  });

  // Update settings
  ipcMain.handle('settings:update', (_event, newSettings: Record<string, any>) => {
    const db = getDatabase();

    const upsert = db.prepare(`
      INSERT INTO settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    for (const [key, value] of Object.entries(newSettings)) {
      upsert.run(key, JSON.stringify(value));
    }

    return newSettings;
  });
};
