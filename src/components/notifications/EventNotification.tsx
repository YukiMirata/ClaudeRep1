import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';
import { Event } from '../../types/event';
import { formatCalendar } from '../../lib/date-utils';

interface EventNotificationProps {
  event: Event;
  occurrenceTime: number;
  onDismiss: () => void;
  isVisible: boolean;
}

const EventNotification = ({ event, occurrenceTime, onDismiss, isVisible }: EventNotificationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-24 right-8 z-[100] w-96"
        >
          <div
            className="relative rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${event.color}30, ${event.color}10)`,
              boxShadow: `0 20px 60px ${event.color}40, 0 0 80px ${event.color}20`,
            }}
          >
            {/* Color accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{
                background: `linear-gradient(90deg, ${event.color}, ${event.color}88)`,
                boxShadow: `0 0 20px ${event.color}60`,
              }}
            />

            {/* Content */}
            <div className="p-6 pt-8">
              {/* Close button */}
              <motion.button
                onClick={onDismiss}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="text-white" size={16} />
              </motion.button>

              {/* Event icon/color indicator */}
              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  className="p-3 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${event.color}, ${event.color}dd)`,
                    boxShadow: `0 0 30px ${event.color}50`,
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeInOut',
                  }}
                >
                  <Calendar className="text-white" size={24} />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xl font-bold mb-1 text-white truncate"
                    style={{ textShadow: `0 2px 10px ${event.color}80` }}
                  >
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-sm text-slate-300 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Time info */}
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
                <Clock size={14} />
                <span>{formatCalendar(occurrenceTime)}</span>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {event.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-lg bg-white/10 text-white border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                border: `2px solid ${event.color}40`,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventNotification;
