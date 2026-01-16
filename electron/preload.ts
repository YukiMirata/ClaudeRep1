import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // Window controls
  toggleAlwaysOnTop: (enabled: boolean) => ipcRenderer.invoke('toggle-always-on-top', enabled),
  getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),

  // Events CRUD
  createEvent: (event: any) => ipcRenderer.invoke('event:create', event),
  getEvents: () => ipcRenderer.invoke('event:get-all'),
  getEvent: (id: string) => ipcRenderer.invoke('event:get', id),
  updateEvent: (id: string, event: any) => ipcRenderer.invoke('event:update', id, event),
  deleteEvent: (id: string) => ipcRenderer.invoke('event:delete', id),

  // Event occurrences
  getUpcomingOccurrences: (hours: number) => ipcRenderer.invoke('event:get-upcoming', hours),
  getActiveOccurrences: () => ipcRenderer.invoke('event:get-active'),
  getRecentOccurrences: (hours: number) => ipcRenderer.invoke('event:get-recent', hours),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings: any) => ipcRenderer.invoke('settings:update', settings),

  // Event listeners
  onEventTriggered: (callback: (event: any) => void) => {
    const subscription = (_event: any, data: any) => callback(data);
    ipcRenderer.on('event:triggered', subscription);
    return () => ipcRenderer.removeListener('event:triggered', subscription);
  },

  onEventUpdate: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('event:updated', subscription);
    return () => ipcRenderer.removeListener('event:updated', subscription);
  },
});

// TypeScript types for the exposed API
export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  toggleAlwaysOnTop: (enabled: boolean) => Promise<boolean>;
  getAlwaysOnTop: () => Promise<boolean>;
  createEvent: (event: any) => Promise<any>;
  getEvents: () => Promise<any[]>;
  getEvent: (id: string) => Promise<any>;
  updateEvent: (id: string, event: any) => Promise<any>;
  deleteEvent: (id: string) => Promise<void>;
  getUpcomingOccurrences: (hours: number) => Promise<any[]>;
  getActiveOccurrences: () => Promise<any[]>;
  getRecentOccurrences: (hours: number) => Promise<any[]>;
  getSettings: () => Promise<any>;
  updateSettings: (settings: any) => Promise<any>;
  onEventTriggered: (callback: (event: any) => void) => () => void;
  onEventUpdate: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
