import { motion } from 'framer-motion';
import { Calendar, Clock, Settings as SettingsIcon } from 'lucide-react';

type Page = 'events' | 'timeline' | 'settings';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const navItems = [
    { id: 'events' as Page, label: 'Manage Events', icon: Calendar },
    { id: 'timeline' as Page, label: 'Timeline', icon: Clock },
    { id: 'settings' as Page, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="px-8 py-4 border-b border-white/5">
      <div className="flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`
                relative px-6 py-3 rounded-xl font-medium text-sm
                transition-colors duration-200
                ${isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Content */}
              <div className="relative flex items-center gap-2">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
