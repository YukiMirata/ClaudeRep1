import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

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

const EventManagement = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full p-8 overflow-auto"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Manage Events</h2>
            <p className="text-slate-400">Create and organize your events</p>
          </div>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium text-white flex items-center gap-2 shadow-lg shadow-blue-500/20"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>New Event</span>
          </motion.button>
        </div>

        {/* Placeholder content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <div className="h-32 flex items-center justify-center text-slate-500">
                Event Card {i}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EventManagement;
