import { RRule, RRuleSet, rrulestr } from 'rrule';

export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurrenceOptions {
  frequency: RecurrenceFrequency;
  interval: number;
  byWeekday?: number[]; // [RRule.MO.weekday, RRule.TU.weekday, ...]
  byMonthDay?: number[];
  byMonth?: number[];
  bySetPos?: number; // For "last Friday" patterns: -1
  count?: number; // Limit occurrences
  until?: Date; // End date
}

/**
 * Create an RRule string from recurrence options
 */
export const createRecurrenceRule = (
  startDate: Date,
  options: RecurrenceOptions
): string => {
  const freq = RRule[options.frequency];

  const rule = new RRule({
    freq,
    dtstart: startDate,
    interval: options.interval,
    byweekday: options.byWeekday,
    bymonthday: options.byMonthDay,
    bymonth: options.byMonth,
    bysetpos: options.bySetPos,
    count: options.count,
    until: options.until,
  });

  return rule.toString();
};

/**
 * Get the next N occurrences from a recurrence rule
 */
export const getNextOccurrences = (
  ruleString: string,
  count: number = 10,
  after?: Date
): Date[] => {
  try {
    const rule = rrulestr(ruleString);
    if (after) {
      return rule.after(after, true) ? rule.all((date, i) => i < count && date > after) : [];
    }
    return rule.all((date, i) => i < count);
  } catch (error) {
    console.error('Error parsing recurrence rule:', error);
    return [];
  }
};

/**
 * Get occurrences between two dates
 */
export const getOccurrencesBetween = (
  ruleString: string,
  startDate: Date,
  endDate: Date
): Date[] => {
  try {
    const rule = rrulestr(ruleString);
    return rule.between(startDate, endDate, true);
  } catch (error) {
    console.error('Error parsing recurrence rule:', error);
    return [];
  }
};

/**
 * Get a human-readable description of the recurrence rule
 */
export const getRecurrenceDescription = (ruleString: string): string => {
  try {
    const rule = rrulestr(ruleString);
    return rule.toText();
  } catch (error) {
    return 'Invalid recurrence rule';
  }
};

/**
 * Recurrence presets for common patterns
 */
export const RECURRENCE_PRESETS = {
  daily: (startDate: Date): string =>
    createRecurrenceRule(startDate, {
      frequency: 'DAILY',
      interval: 1,
    }),

  weekdays: (startDate: Date): string =>
    createRecurrenceRule(startDate, {
      frequency: 'WEEKLY',
      interval: 1,
      byWeekday: [
        RRule.MO.weekday,
        RRule.TU.weekday,
        RRule.WE.weekday,
        RRule.TH.weekday,
        RRule.FR.weekday,
      ],
    }),

  weekly: (startDate: Date): string =>
    createRecurrenceRule(startDate, {
      frequency: 'WEEKLY',
      interval: 1,
    }),

  biweekly: (startDate: Date): string =>
    createRecurrenceRule(startDate, {
      frequency: 'WEEKLY',
      interval: 2,
    }),

  monthly: (startDate: Date): string =>
    createRecurrenceRule(startDate, {
      frequency: 'MONTHLY',
      interval: 1,
    }),

  yearly: (startDate: Date): string =>
    createRecurrenceRule(startDate, {
      frequency: 'YEARLY',
      interval: 1,
    }),

  // Last Friday of every month
  lastFriday: (startDate: Date): string =>
    createRecurrenceRule(startDate, {
      frequency: 'MONTHLY',
      interval: 1,
      byWeekday: [RRule.FR.weekday],
      bySetPos: -1,
    }),

  // First Monday of every month
  firstMonday: (startDate: Date): string =>
    createRecurrenceRule(startDate, {
      frequency: 'MONTHLY',
      interval: 1,
      byWeekday: [RRule.MO.weekday],
      bySetPos: 1,
    }),
};
