import { useEffect, useRef } from 'react';

/**
 * Hook for setting up intervals that automatically clean up
 */
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    const tick = () => {
      savedCallback.current?.();
    };

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * Hook for real-time updates (every second)
 */
export const useRealtime = (callback: () => void, enabled: boolean = true) => {
  useInterval(callback, enabled ? 1000 : null);
};
