export interface Event {
  id: string;
  title: string;
  description?: string;
  color: string;

  // Recurrence
  recurrenceRule: string;
  startDate: number;
  endDate?: number;

  // Audio
  soundFile?: string;
  soundVolume: number;

  // Settings
  isEnabled: boolean;
  priority: number;
  tags: string[];

  // Metadata
  createdAt: number;
  updatedAt: number;
  lastTriggered?: number;
}

export interface EventOccurrence {
  id: string;
  eventId: string;
  event: Event;
  occurrenceTime: number;
  wasShown: boolean;
  wasDismissed: boolean;
}

export interface CreateEventData {
  title: string;
  description?: string;
  color: string;
  recurrenceRule: string;
  startDate: number;
  endDate?: number;
  soundFile?: string;
  soundVolume?: number;
  isEnabled?: boolean;
  priority?: number;
  tags?: string[];
}
