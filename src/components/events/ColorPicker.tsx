import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  { name: 'Blue', value: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
  { name: 'Purple', value: '#a855f7', gradient: 'from-purple-500 to-purple-600' },
  { name: 'Pink', value: '#ec4899', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Red', value: '#ef4444', gradient: 'from-red-500 to-red-600' },
  { name: 'Orange', value: '#f97316', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Amber', value: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },
  { name: 'Yellow', value: '#eab308', gradient: 'from-yellow-500 to-yellow-600' },
  { name: 'Lime', value: '#84cc16', gradient: 'from-lime-500 to-lime-600' },
  { name: 'Green', value: '#22c55e', gradient: 'from-green-500 to-green-600' },
  { name: 'Emerald', value: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
  { name: 'Teal', value: '#14b8a6', gradient: 'from-teal-500 to-teal-600' },
  { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-500 to-cyan-600' },
  { name: 'Sky', value: '#0ea5e9', gradient: 'from-sky-500 to-sky-600' },
  { name: 'Indigo', value: '#6366f1', gradient: 'from-indigo-500 to-indigo-600' },
  { name: 'Violet', value: '#8b5cf6', gradient: 'from-violet-500 to-violet-600' },
  { name: 'Fuchsia', value: '#d946ef', gradient: 'from-fuchsia-500 to-fuchsia-600' },
  { name: 'Rose', value: '#f43f5e', gradient: 'from-rose-500 to-rose-600' },
  { name: 'Slate', value: '#64748b', gradient: 'from-slate-500 to-slate-600' },
];

const ColorPicker = ({ value, onChange, label }: ColorPickerProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-3">
          {label}
        </label>
      )}

      <div className="grid grid-cols-6 gap-3">
        {PRESET_COLORS.map((color) => {
          const isSelected = value === color.value;

          return (
            <motion.button
              key={color.value}
              type="button"
              onClick={() => onChange(color.value)}
              className="relative group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Color circle */}
              <div
                className={`
                  w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient}
                  transition-all duration-200
                  ${isSelected ? 'ring-4 ring-white/30 shadow-lg' : 'ring-2 ring-white/10'}
                  group-hover:ring-white/40 group-hover:shadow-xl
                `}
                style={{
                  boxShadow: isSelected
                    ? `0 0 30px ${color.value}50`
                    : `0 0 15px ${color.value}30`,
                }}
              >
                {/* Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check className="text-white" size={20} strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="px-2 py-1 bg-slate-900 rounded text-xs text-white whitespace-nowrap">
                  {color.name}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom color input */}
      <div className="mt-4 flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-2 border-white/10"
        />
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
