import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Volume2, Monitor } from 'lucide-react';

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
          {[
            { icon: Palette, title: 'Appearance', desc: 'Theme, colors, and visual preferences' },
            { icon: Volume2, title: 'Notifications', desc: 'Sound and alert settings' },
            { icon: Monitor, title: 'Window', desc: 'Always on top and window behavior' },
            { icon: SettingsIcon, title: 'General', desc: 'App preferences and data management' },
          ].map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.01,
                  borderColor: 'rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    <Icon className="text-blue-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{section.title}</h3>
                    <p className="text-sm text-slate-400">{section.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
