import { motion } from 'framer-motion';
import { Clock, Edit2, Trash2, Bell, MoreVertical } from 'lucide-react';
import { Event } from '../../types/event';
import { formatRelative, formatCalendar } from '../../lib/date-utils';
import { getNextOccurrence } from '../../lib/event-engine';
import { getRecurrenceDescription } from '../../lib/recurrence';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
  const nextOccurrence = getNextOccurrence(event);
  const recurrenceText = getRecurrenceDescription(event.recurrenceRule);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="group relative"
    >
      {/* Card */}
      <div
        className={`
          p-5 rounded-2xl backdrop-blur-sm
          bg-gradient-to-br from-white/10 to-white/5
          border border-white/10
          transition-all duration-300
          hover:border-white/20
          hover:shadow-2xl
          ${!event.isEnabled && 'opacity-50'}
        `}
        style={{
          boxShadow: `0 4px 20px ${event.color}15`,
        }}
      >
        {/* Color accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, ${event.color}, ${event.color}88)`,
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold mb-1 truncate"
              style={{ color: event.color }}
            >
              {event.title}
            </h3>
            {event.description && (
              <p className="text-sm text-slate-400 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              onClick={() => onEdit(event)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit2 size={16} />
            </motion.button>
            <motion.button
              onClick={() => onDelete(event)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>

        {/* Recurrence info */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <Clock size={14} />
          <span className="capitalize">{recurrenceText}</span>
        </div>

        {/* Next occurrence */}
        {nextOccurrence && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Next:</span>
              <span className="text-sm font-medium text-slate-300">
                {formatCalendar(nextOccurrence)}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {event.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-lg bg-white/5 text-slate-400 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Sound indicator */}
        {event.soundFile && (
          <div className="absolute bottom-3 right-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-lg bg-white/5"
            >
              <Bell size={14} className="text-slate-400" />
            </motion.div>
          </div>
        )}

        {/* Status badge */}
        {!event.isEnabled && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-400">
              Disabled
            </span>
          </div>
        )}
      </div>

      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
        style={{
          background: `radial-gradient(circle at center, ${event.color}30, transparent 70%)`,
        }}
      />
    </motion.div>
  );
};

export default EventCard;
