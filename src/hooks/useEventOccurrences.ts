import { useMemo } from 'react';
import { useEventsStore } from '../stores/useEventsStore';
import {
  getActiveOccurrences,
  getUpcomingOccurrences,
  getRecentOccurrences,
} from '../lib/event-engine';
import { EventOccurrence } from '../types/event';

/**
 * Hook to get active event occurrences (currently happening)
 */
export const useActiveOccurrences = (limit: number = 4): EventOccurrence[] => {
  const events = useEventsStore((state) => state.events);

  return useMemo(() => {
    const occurrences = getActiveOccurrences(events);
    return occurrences.slice(0, limit);
  }, [events, limit]);
};

/**
 * Hook to get upcoming event occurrences
 */
export const useUpcomingOccurrences = (
  lookAheadHours: number = 24,
  limit: number = 10
): EventOccurrence[] => {
  const events = useEventsStore((state) => state.events);

  return useMemo(() => {
    const occurrences = getUpcomingOccurrences(events, new Date(), lookAheadHours);
    return occurrences.slice(0, limit);
  }, [events, lookAheadHours, limit]);
};

/**
 * Hook to get recent event occurrences (just happened)
 */
export const useRecentOccurrences = (
  lookBackHours: number = 2,
  limit: number = 4
): EventOccurrence[] => {
  const events = useEventsStore((state) => state.events);

  return useMemo(() => {
    const occurrences = getRecentOccurrences(events, new Date(), lookBackHours);
    return occurrences.slice(0, limit);
  }, [events, lookBackHours, limit]);
};

/**
 * Hook to get all timeline occurrences (active + recent)
 */
export const useTimelineOccurrences = () => {
  const activeOccurrences = useActiveOccurrences(4);
  const recentOccurrences = useRecentOccurrences(2, 4);

  return useMemo(
    () => ({
      active: activeOccurrences,
      recent: recentOccurrences,
    }),
    [activeOccurrences, recentOccurrences]
  );
};
