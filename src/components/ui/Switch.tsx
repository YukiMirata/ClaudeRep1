import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const Switch = ({ checked, onChange, label, description, disabled }: SwitchProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        {label && (
          <div className="text-sm font-medium text-white mb-1">{label}</div>
        )}
        {description && (
          <div className="text-xs text-slate-400">{description}</div>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-7 w-12 items-center rounded-full
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50
          ${checked ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-white/10'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow-lg
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default Switch;
