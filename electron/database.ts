import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db: Database.Database | null = null;

export const initDatabase = async (): Promise<void> => {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'events.db');

  db = new Database(dbPath);

  // Enable WAL mode for better concurrent access
  db.pragma('journal_mode = WAL');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      color TEXT NOT NULL,
      sound_file TEXT,
      sound_volume REAL DEFAULT 1.0,

      recurrence_rule TEXT NOT NULL,
      start_date INTEGER NOT NULL,
      end_date INTEGER,

      is_enabled INTEGER DEFAULT 1,
      priority INTEGER DEFAULT 0,
      tags TEXT,

      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      last_triggered INTEGER
    );

    CREATE TABLE IF NOT EXISTS event_occurrences (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      occurrence_time INTEGER NOT NULL,
      was_shown INTEGER DEFAULT 0,
      was_dismissed INTEGER DEFAULT 0,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
    CREATE INDEX IF NOT EXISTS idx_events_enabled ON events(is_enabled);
    CREATE INDEX IF NOT EXISTS idx_occurrences_time ON event_occurrences(occurrence_time);
    CREATE INDEX IF NOT EXISTS idx_occurrences_event ON event_occurrences(event_id);
  `);

  // Insert default settings if not exists
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };

  if (settingsCount.count === 0) {
    const defaultSettings = {
      theme: 'dark',
      alwaysOnTop: true,
      soundsEnabled: true,
      notificationsEnabled: true,
      checkIntervalMs: 30000,
    };

    const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    for (const [key, value] of Object.entries(defaultSettings)) {
      insert.run(key, JSON.stringify(value));
    }
  }
};

export const getDatabase = (): Database.Database => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
  }
};
