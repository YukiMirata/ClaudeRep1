import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

export interface AudioOptions {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
}

/**
 * Hook for playing audio files
 */
export const useAudio = (src?: string, options: AudioOptions = {}) => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!src) return;

    // Create Howl instance
    const sound = new Howl({
      src: [src],
      volume: options.volume ?? 1.0,
      loop: options.loop ?? false,
      autoplay: options.autoplay ?? false,
      onload: () => {
        setDuration(sound.duration());
      },
      onplay: () => {
        setPlaying(true);
      },
      onpause: () => {
        setPlaying(false);
      },
      onend: () => {
        setPlaying(false);
      },
      onstop: () => {
        setPlaying(false);
      },
    });

    soundRef.current = sound;

    // Cleanup
    return () => {
      sound.unload();
    };
  }, [src, options.volume, options.loop, options.autoplay]);

  const play = () => {
    if (soundRef.current && !playing) {
      soundRef.current.play();
    }
  };

  const pause = () => {
    if (soundRef.current && playing) {
      soundRef.current.pause();
    }
  };

  const stop = () => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
  };

  const setVolume = (volume: number) => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  };

  return {
    play,
    pause,
    stop,
    setVolume,
    playing,
    duration,
  };
};

/**
 * Hook for one-shot sound effects
 */
export const useSoundEffect = () => {
  const playSound = (src: string, volume: number = 1.0) => {
    const sound = new Howl({
      src: [src],
      volume,
      autoplay: true,
    });

    // Auto-cleanup after play
    sound.once('end', () => {
      sound.unload();
    });
  };

  return { playSound };
};
