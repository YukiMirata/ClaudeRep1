export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  alwaysOnTop: boolean;
  soundsEnabled: boolean;
  notificationsEnabled: boolean;
  checkIntervalMs: number;
  windowOpacity?: number;
  startOnBoot?: boolean;
}
