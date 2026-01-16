import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, Pause, Check, Music } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

interface SoundPickerProps {
  value?: string;
  onChange: (soundFile: string) => void;
  label?: string;
}

const DEFAULT_SOUNDS = [
  { id: 'bell', name: 'Bell', file: '/sounds/bell.mp3', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'chime', name: 'Chime', file: '/sounds/chime.mp3', gradient: 'from-purple-500 to-pink-500' },
  { id: 'ding', name: 'Ding', file: '/sounds/ding.mp3', gradient: 'from-green-500 to-emerald-500' },
  { id: 'alert', name: 'Alert', file: '/sounds/alert.mp3', gradient: 'from-orange-500 to-amber-500' },
  { id: 'notify', name: 'Notify', file: '/sounds/notify.mp3', gradient: 'from-rose-500 to-red-500' },
  { id: 'ping', name: 'Ping', file: '/sounds/ping.mp3', gradient: 'from-indigo-500 to-violet-500' },
];

const SoundPicker = ({ value, onChange, label }: SoundPickerProps) => {
  const [previewSound, setPreviewSound] = useState<string | null>(null);
  const { play: playPreview, stop: stopPreview, playing } = useAudio(previewSound || undefined);

  const handleSoundSelect = (soundFile: string) => {
    onChange(soundFile);
  };

  const handlePreview = (soundFile: string) => {
    if (playing && previewSound === soundFile) {
      stopPreview();
      setPreviewSound(null);
    } else {
      stopPreview();
      setPreviewSound(soundFile);
      setTimeout(() => playPreview(), 100);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-3">
          {label}
        </label>
      )}

      {/* Sound grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {DEFAULT_SOUNDS.map((sound) => {
          const isSelected = value === sound.file;
          const isPreviewing = playing && previewSound === sound.file;

          return (
            <motion.div
              key={sound.id}
              className="relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="button"
                onClick={() => handleSoundSelect(sound.file)}
                className={`
                  w-full p-4 rounded-xl
                  bg-gradient-to-br ${sound.gradient}
                  transition-all duration-200
                  ${isSelected ? 'ring-4 ring-white/30 shadow-xl' : 'ring-2 ring-white/10'}
                  hover:ring-white/40
                `}
                style={{
                  boxShadow: isSelected
                    ? '0 0 30px rgba(59, 130, 246, 0.3)'
                    : '0 0 15px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-2">
                  <div className="p-3 rounded-full bg-white/20">
                    <Music className="text-white" size={24} />
                  </div>
                </div>

                {/* Name */}
                <div className="text-sm font-medium text-white text-center">
                  {sound.name}
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/90"
                  >
                    <Check className="text-blue-600" size={16} strokeWidth={3} />
                  </motion.div>
                )}
              </button>

              {/* Preview button */}
              <motion.button
                type="button"
                onClick={() => handlePreview(sound.file)}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPreviewing ? (
                  <Pause className="text-white" size={14} />
                ) : (
                  <Play className="text-white" size={14} />
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Custom sound (coming soon) */}
      <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Volume2 size={16} />
          <span>Custom sound files coming soon!</span>
        </div>
      </div>
    </div>
  );
};

export default SoundPicker;
