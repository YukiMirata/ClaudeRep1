import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Volume2, Monitor, Save, RefreshCw } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';
import Switch from '../components/ui/Switch';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, x: -20, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    x: 20,
    filter: 'blur(10px)',
    transition: { duration: 0.3 }
  },
};

const Settings = () => {
  const settings = useSettingsStore((state) => state.settings);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const toggleAlwaysOnTop = useSettingsStore((state) => state.toggleAlwaysOnTop);
  const toggleSounds = useSettingsStore((state) => state.toggleSounds);
  const toggleNotifications = useSettingsStore((state) => state.toggleNotifications);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleTestNotification = async () => {
    if (window.electronAPI?.triggerTestNotification) {
      await window.electronAPI.triggerTestNotification();
      toast.success('Test notification sent!');
    } else {
      toast.error('Test notification not available');
    }
  };

  if (!settings) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full p-8 overflow-auto flex items-center justify-center"
      >
        <div className="text-slate-400">Loading settings...</div>
      </motion.div>
    );
  }

  const handleToggleAlwaysOnTop = async () => {
    await toggleAlwaysOnTop();
    toast.success(
      settings.alwaysOnTop
        ? 'Always on top disabled'
        : 'Always on top enabled'
    );
  };

  const handleToggleSounds = async () => {
    await toggleSounds();
    toast.success(
      settings.soundsEnabled
        ? 'Sounds disabled'
        : 'Sounds enabled'
    );
  };

  const handleToggleNotifications = async () => {
    await toggleNotifications();
    toast.success(
      settings.notificationsEnabled
        ? 'Notifications disabled'
        : 'Notifications enabled'
    );
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full p-8 overflow-auto"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
          <p className="text-slate-400">Customize your experience</p>
        </div>

        {/* Settings sections */}
        <div className="space-y-6">
          {/* Window Settings */}
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <Monitor className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Window Behavior</h3>
                <p className="text-sm text-slate-400">Control how the app window behaves</p>
              </div>
            </div>

            <div className="space-y-4">
              <Switch
                checked={settings.alwaysOnTop}
                onChange={handleToggleAlwaysOnTop}
                label="Always on Top"
                description="Keep the app window above all other windows"
              />
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                <Volume2 className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <p className="text-sm text-slate-400">Sound and alert preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <Switch
                checked={settings.notificationsEnabled}
                onChange={handleToggleNotifications}
                label="Enable Notifications"
                description="Show notifications when events trigger"
              />

              <Switch
                checked={settings.soundsEnabled}
                onChange={handleToggleSounds}
                label="Enable Sounds"
                description="Play sounds for event notifications"
              />

              <div className="pt-4 border-t border-white/10">
                <Button onClick={handleTestNotification} variant="secondary" size="sm">
                  <Volume2 size={16} />
                  <span>Test Notification</span>
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  Trigger a test notification to see how they work
                </p>
              </div>
            </div>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <Palette className="text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Appearance</h3>
                <p className="text-sm text-slate-400">Visual preferences and theme</p>
              </div>
            </div>

            <div className="space-y-4">
              <Select
                label="Theme"
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as any })}
                options={[
                  { value: 'dark', label: 'Dark (Current)' },
                  { value: 'light', label: 'Light (Coming Soon)' },
                  { value: 'auto', label: 'Auto (Coming Soon)' },
                ]}
              />
            </div>
          </motion.div>

          {/* Advanced Settings */}
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20">
                <SettingsIcon className="text-orange-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Advanced</h3>
                <p className="text-sm text-slate-400">Technical settings and performance</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Check Interval: {settings.checkIntervalMs / 1000}s
                </label>
                <input
                  type="range"
                  min="10000"
                  max="60000"
                  step="5000"
                  value={settings.checkIntervalMs}
                  onChange={(e) => updateSettings({ checkIntervalMs: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-xs text-slate-400 mt-2">
                  How often to check for upcoming events (10-60 seconds)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <SettingsIcon className="text-blue-400" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-300 mb-1">
                  Settings are saved automatically
                </h4>
                <p className="text-xs text-slate-400">
                  All changes are applied immediately and saved to your local database.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </motion.div>
  );
};

export default Settings;
