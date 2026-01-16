import { create } from 'zustand';
import { AppSettings } from '../types/settings';

interface SettingsState {
  settings: AppSettings | null;
  loading: boolean;

  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  toggleAlwaysOnTop: () => Promise<void>;
  toggleSounds: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  alwaysOnTop: true,
  soundsEnabled: true,
  notificationsEnabled: true,
  checkIntervalMs: 30000,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const settings = await window.electronAPI.getSettings();
      set({ settings: { ...defaultSettings, ...settings }, loading: false });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      set({ loading: false });
    }
  },

  updateSettings: async (newSettings: Partial<AppSettings>) => {
    const current = get().settings || defaultSettings;
    const updated = { ...current, ...newSettings };

    set({ settings: updated });

    try {
      await window.electronAPI.updateSettings(newSettings);

      // Handle always-on-top toggle
      if (newSettings.alwaysOnTop !== undefined) {
        await window.electronAPI.toggleAlwaysOnTop(newSettings.alwaysOnTop);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      // Revert on error
      set({ settings: current });
    }
  },

  toggleAlwaysOnTop: async () => {
    const current = get().settings;
    if (!current) return;

    await get().updateSettings({ alwaysOnTop: !current.alwaysOnTop });
  },

  toggleSounds: async () => {
    const current = get().settings;
    if (!current) return;

    await get().updateSettings({ soundsEnabled: !current.soundsEnabled });
  },

  toggleNotifications: async () => {
    const current = get().settings;
    if (!current) return;

    await get().updateSettings({ notificationsEnabled: !current.notificationsEnabled });
  },
}));
