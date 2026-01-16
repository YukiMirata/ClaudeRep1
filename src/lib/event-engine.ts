import { Event, EventOccurrence } from '../types/event';
import { getOccurrencesBetween } from './recurrence';
import { randomUUID } from './utils';

/**
 * Calculate event occurrences for a given time range
 */
export const calculateOccurrences = (
  event: Event,
  startTime: Date,
  endTime: Date
): EventOccurrence[] => {
  if (!event.isEnabled) {
    return [];
  }

  // Check if event is within the active period
  const eventStart = new Date(event.startDate);
  const eventEnd = event.endDate ? new Date(event.endDate) : null;

  if (eventEnd && eventEnd < startTime) {
    return []; // Event has ended before the range
  }

  if (eventStart > endTime) {
    return []; // Event hasn't started yet
  }

  try {
    // Get occurrences from recurrence rule
    const occurrenceDates = getOccurrencesBetween(
      event.recurrenceRule,
      startTime,
      endTime
    );

    // Convert to EventOccurrence objects
    return occurrenceDates.map((date) => ({
      id: randomUUID(),
      eventId: event.id,
      event,
      occurrenceTime: date.getTime(),
      wasShown: false,
      wasDismissed: false,
    }));
  } catch (error) {
    console.error('Error calculating occurrences for event:', event.id, error);
    return [];
  }
};

/**
 * Get all active occurrences (currently happening)
 */
export const getActiveOccurrences = (
  events: Event[],
  now: Date = new Date(),
  durationMs: number = 5 * 60 * 1000 // 5 minutes default duration
): EventOccurrence[] => {
  const startTime = new Date(now.getTime() - durationMs);
  const endTime = now;

  const allOccurrences: EventOccurrence[] = [];

  for (const event of events) {
    const occurrences = calculateOccurrences(event, startTime, endTime);
    allOccurrences.push(...occurrences);
  }

  // Sort by occurrence time (most recent first)
  return allOccurrences
    .sort((a, b) => b.occurrenceTime - a.occurrenceTime)
    .slice(0, 10); // Limit to 10
};

/**
 * Get upcoming occurrences
 */
export const getUpcomingOccurrences = (
  events: Event[],
  now: Date = new Date(),
  lookAheadHours: number = 24
): EventOccurrence[] => {
  const startTime = now;
  const endTime = new Date(now.getTime() + lookAheadHours * 60 * 60 * 1000);

  const allOccurrences: EventOccurrence[] = [];

  for (const event of events) {
    const occurrences = calculateOccurrences(event, startTime, endTime);
    allOccurrences.push(...occurrences);
  }

  // Sort by occurrence time (soonest first)
  return allOccurrences
    .sort((a, b) => a.occurrenceTime - b.occurrenceTime)
    .slice(0, 20); // Limit to 20
};

/**
 * Get recent occurrences (just happened)
 */
export const getRecentOccurrences = (
  events: Event[],
  now: Date = new Date(),
  lookBackHours: number = 2
): EventOccurrence[] => {
  const startTime = new Date(now.getTime() - lookBackHours * 60 * 60 * 1000);
  const endTime = now;

  const allOccurrences: EventOccurrence[] = [];

  for (const event of events) {
    const occurrences = calculateOccurrences(event, startTime, endTime);
    allOccurrences.push(...occurrences);
  }

  // Sort by occurrence time (most recent first)
  return allOccurrences
    .sort((a, b) => b.occurrenceTime - a.occurrenceTime)
    .slice(0, 10); // Limit to 10
};

/**
 * Check if an event is currently active
 */
export const isEventActive = (
  event: Event,
  now: Date = new Date(),
  durationMs: number = 5 * 60 * 1000
): boolean => {
  const occurrences = getActiveOccurrences([event], now, durationMs);
  return occurrences.length > 0;
};

/**
 * Get the next occurrence for a specific event
 */
export const getNextOccurrence = (
  event: Event,
  after: Date = new Date()
): Date | null => {
  const lookAhead = new Date(after.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year
  const occurrences = calculateOccurrences(event, after, lookAhead);

  if (occurrences.length === 0) {
    return null;
  }

  return new Date(occurrences[0].occurrenceTime);
};
