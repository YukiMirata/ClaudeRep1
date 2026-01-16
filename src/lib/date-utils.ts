import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

/**
 * Format a date relative to now (e.g., "2 hours ago", "in 5 minutes")
 */
export const formatRelative = (date: Date | number): string => {
  return dayjs(date).fromNow();
};

/**
 * Format a date in calendar format (e.g., "Today at 3:00 PM", "Tomorrow at 9:00 AM")
 */
export const formatCalendar = (date: Date | number): string => {
  return dayjs(date).calendar(null, {
    sameDay: '[Today at] h:mm A',
    nextDay: '[Tomorrow at] h:mm A',
    nextWeek: 'dddd [at] h:mm A',
    lastDay: '[Yesterday at] h:mm A',
    lastWeek: '[Last] dddd [at] h:mm A',
    sameElse: 'MMM D, YYYY [at] h:mm A',
  });
};

/**
 * Format a date in a specific format
 */
export const formatDate = (
  date: Date | number,
  format: string = 'MMM D, YYYY h:mm A'
): string => {
  return dayjs(date).format(format);
};

/**
 * Format duration in human-readable form (e.g., "2 hours 30 minutes")
 */
export const formatDuration = (milliseconds: number): string => {
  const dur = dayjs.duration(milliseconds);

  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && days === 0 && hours === 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
};

/**
 * Get time until a future date (e.g., "in 2 hours")
 */
export const getTimeUntil = (date: Date | number): string => {
  return dayjs(date).fromNow();
};

/**
 * Get time since a past date (e.g., "2 hours ago")
 */
export const getTimeSince = (date: Date | number): string => {
  return dayjs(date).fromNow();
};

/**
 * Check if a date is between two other dates
 */
export const isBetweenDates = (
  date: Date | number,
  start: Date | number,
  end: Date | number
): boolean => {
  return dayjs(date).isBetween(start, end, null, '[]');
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | number): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date | number): boolean => {
  return dayjs(date).isBefore(dayjs());
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: Date | number): boolean => {
  return dayjs(date).isAfter(dayjs());
};

/**
 * Add time to a date
 */
export const addTime = (
  date: Date | number,
  amount: number,
  unit: 'day' | 'hour' | 'minute' | 'second'
): Date => {
  return dayjs(date).add(amount, unit).toDate();
};

/**
 * Subtract time from a date
 */
export const subtractTime = (
  date: Date | number,
  amount: number,
  unit: 'day' | 'hour' | 'minute' | 'second'
): Date => {
  return dayjs(date).subtract(amount, unit).toDate();
};

/**
 * Get the start of a time unit (e.g., start of day, start of hour)
 */
export const startOf = (
  date: Date | number,
  unit: 'day' | 'hour' | 'minute' | 'second'
): Date => {
  return dayjs(date).startOf(unit).toDate();
};

/**
 * Get the end of a time unit
 */
export const endOf = (
  date: Date | number,
  unit: 'day' | 'hour' | 'minute' | 'second'
): Date => {
  return dayjs(date).endOf(unit).toDate();
};

export default dayjs;
