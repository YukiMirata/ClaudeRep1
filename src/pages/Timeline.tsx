import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';

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

const Timeline = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full p-8 overflow-auto"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Timeline</h2>
          <p className="text-slate-400">Your events at a glance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Still Happening */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-blue-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Still Happening</h3>
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">4</span>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-400/20 backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Event {i}</div>
                      <div className="text-xs text-slate-400 mt-1">In progress...</div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Just Happened */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Just Happened</h3>
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">4</span>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-400/20 backdrop-blur-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(34, 197, 94, 0.4)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Event {i}</div>
                      <div className="text-xs text-slate-400 mt-1">{i} min ago</div>
                    </div>
                    <CheckCircle className="text-green-400" size={16} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Timeline;
