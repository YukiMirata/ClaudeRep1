import path from 'path';
import { app } from 'electron';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

interface EventData {
  id: string;
  title: string;
  description?: string;
  color: string;
  soundFile?: string;
  soundVolume: number;
  recurrenceRule: string;
  startDate: number;
  endDate?: number;
  isEnabled: boolean;
  priority: number;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  lastTriggered?: number;
}

interface OccurrenceData {
  id: string;
  eventId: string;
  occurrenceTime: number;
  wasShown: boolean;
  wasDismissed: boolean;
}

interface DatabaseSchema {
  events: EventData[];
  occurrences: OccurrenceData[];
  settings: Record<string, any>;
}

let db: Low<DatabaseSchema> | null = null;

export const initDatabase = async (): Promise<void> => {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'events.json');

  // Create adapter
  const adapter = new JSONFile<DatabaseSchema>(dbPath);

  // Initialize database
  db = new Low(adapter, {
    events: [],
    occurrences: [],
    settings: {},
  });

  // Read data from JSON file
  await db.read();

  // Initialize default settings if empty
  if (Object.keys(db.data.settings).length === 0) {
    db.data.settings = {
      theme: 'dark',
      alwaysOnTop: true,
      soundsEnabled: true,
      notificationsEnabled: true,
      checkIntervalMs: 30000,
    };
    await db.write();
  }

  console.log('Database initialized with lowdb');
};

export const getDatabase = (): Low<DatabaseSchema> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.write();
    db = null;
  }
};

// Helper functions for common operations

export const getAllEvents = async (): Promise<EventData[]> => {
  const database = getDatabase();
  await database.read();
  return database.data.events;
};

export const getEventById = async (id: string): Promise<EventData | undefined> => {
  const database = getDatabase();
  await database.read();
  return database.data.events.find(e => e.id === id);
};

export const createEvent = async (event: EventData): Promise<EventData> => {
  const database = getDatabase();
  await database.read();
  database.data.events.push(event);
  await database.write();
  return event;
};

export const updateEvent = async (id: string, updates: Partial<EventData>): Promise<EventData | null> => {
  const database = getDatabase();
  await database.read();
  const index = database.data.events.findIndex(e => e.id === id);
  if (index === -1) return null;

  database.data.events[index] = {
    ...database.data.events[index],
    ...updates,
    updatedAt: Date.now(),
  };

  await database.write();
  return database.data.events[index];
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  const database = getDatabase();
  await database.read();
  const initialLength = database.data.events.length;
  database.data.events = database.data.events.filter(e => e.id !== id);

  // Also delete related occurrences
  database.data.occurrences = database.data.occurrences.filter(o => o.eventId !== id);

  await database.write();
  return database.data.events.length < initialLength;
};

export const getSettings = async (): Promise<Record<string, any>> => {
  const database = getDatabase();
  await database.read();
  return database.data.settings;
};

export const updateSettings = async (settings: Record<string, any>): Promise<void> => {
  const database = getDatabase();
  await database.read();
  database.data.settings = {
    ...database.data.settings,
    ...settings,
  };
  await database.write();
};
