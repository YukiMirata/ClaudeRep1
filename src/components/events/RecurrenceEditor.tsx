import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Repeat } from 'lucide-react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import { RECURRENCE_PRESETS, getNextOccurrences } from '../../lib/recurrence';
import { formatCalendar } from '../../lib/date-utils';

interface RecurrenceEditorProps {
  value: string;
  startDate: Date;
  onChange: (rule: string) => void;
  label?: string;
}

const PRESET_OPTIONS = [
  { value: 'daily', label: 'Every Day' },
  { value: 'weekdays', label: 'Every Weekday (Mon-Fri)' },
  { value: 'weekly', label: 'Every Week' },
  { value: 'biweekly', label: 'Every 2 Weeks' },
  { value: 'monthly', label: 'Every Month' },
  { value: 'yearly', label: 'Every Year' },
  { value: 'custom', label: 'Custom...' },
];

const RecurrenceEditor = ({ value, startDate, onChange, label }: RecurrenceEditorProps) => {
  const [preset, setPreset] = useState<string>('daily');
  const [showPreview, setShowPreview] = useState(true);

  // Calculate next occurrences for preview
  const nextOccurrences = value ? getNextOccurrences(value, 5, startDate) : [];

  const handlePresetChange = (presetValue: string) => {
    setPreset(presetValue);

    if (presetValue === 'custom') {
      // Keep current rule
      return;
    }

    // Apply preset
    const presetFunc = RECURRENCE_PRESETS[presetValue as keyof typeof RECURRENCE_PRESETS];
    if (presetFunc) {
      const newRule = presetFunc(startDate);
      onChange(newRule);
    }
  };

  return (
    <div className="w-full space-y-4">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-3">
          {label}
        </label>
      )}

      {/* Preset selector */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Repeat className="text-blue-400" size={18} />
          <span className="text-sm font-medium text-slate-300">Recurrence Pattern</span>
        </div>

        <Select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
          options={PRESET_OPTIONS}
        />
      </div>

      {/* Preview */}
      {showPreview && nextOccurrences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="text-blue-400" size={18} />
            <span className="text-sm font-medium text-blue-300">Next 5 Occurrences</span>
          </div>

          <div className="space-y-2">
            {nextOccurrences.map((date, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                  {i + 1}
                </div>
                <span className="text-sm text-slate-300">
                  {formatCalendar(date)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Custom recurrence (shown when "Custom" is selected) */}
      {preset === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3"
        >
          <p className="text-sm text-slate-400">
            Custom recurrence patterns coming soon! For now, use the presets above.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RecurrenceEditor;
