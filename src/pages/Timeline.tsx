import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import { useEventsStore } from '../stores/useEventsStore';
import { useTimelineOccurrences } from '../hooks/useEventOccurrences';
import { useRealtime } from '../hooks/useInterval';
import { formatRelative, formatCalendar } from '../lib/date-utils';

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
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const { active, recent } = useTimelineOccurrences();

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Real-time updates every second
  useRealtime(() => {
    // Forces re-render to update time displays
  }, true);

  // Ensure minimum 4 items by padding with placeholders
  const activeWithPlaceholders = [...active];
  while (activeWithPlaceholders.length < 4) {
    activeWithPlaceholders.push(null as any);
  }

  const recentWithPlaceholders = [...recent];
  while (recentWithPlaceholders.length < 4) {
    recentWithPlaceholders.push(null as any);
  }

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
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                {active.length}
              </span>
            </div>
            <div className="space-y-3">
              {activeWithPlaceholders.slice(0, 4).map((occurrence, i) => (
                <motion.div
                  key={occurrence?.id || `placeholder-active-${i}`}
                  className={`p-4 rounded-xl backdrop-blur-sm ${
                    occurrence
                      ? 'bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-400/20'
                      : 'bg-slate-800/20 border border-slate-700/20'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={occurrence ? { scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.4)' } : {}}
                >
                  {occurrence ? (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div
                          className="font-medium text-white mb-1"
                          style={{ color: occurrence.event.color }}
                        >
                          {occurrence.event.title}
                        </div>
                        {occurrence.event.description && (
                          <div className="text-xs text-slate-400 mb-2">
                            {occurrence.event.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar size={12} />
                          <span>{formatCalendar(occurrence.occurrenceTime)}</span>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse flex-shrink-0 ml-2 mt-1" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-16 text-slate-600 text-sm">
                      No active events
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Just Happened */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Just Happened</h3>
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">
                {recent.length}
              </span>
            </div>
            <div className="space-y-3">
              {recentWithPlaceholders.slice(0, 4).map((occurrence, i) => (
                <motion.div
                  key={occurrence?.id || `placeholder-recent-${i}`}
                  className={`p-4 rounded-xl backdrop-blur-sm ${
                    occurrence
                      ? 'bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-400/20'
                      : 'bg-slate-800/20 border border-slate-700/20'
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={occurrence ? { scale: 1.02, borderColor: 'rgba(34, 197, 94, 0.4)' } : {}}
                >
                  {occurrence ? (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div
                          className="font-medium text-white mb-1"
                          style={{ color: occurrence.event.color }}
                        >
                          {occurrence.event.title}
                        </div>
                        {occurrence.event.description && (
                          <div className="text-xs text-slate-400 mb-2">
                            {occurrence.event.description}
                          </div>
                        )}
                        <div className="text-xs text-slate-500">
                          {formatRelative(occurrence.occurrenceTime)}
                        </div>
                      </div>
                      <CheckCircle className="text-green-400 flex-shrink-0 ml-2 mt-1" size={16} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-16 text-slate-600 text-sm">
                      No recent events
                    </div>
                  )}
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
