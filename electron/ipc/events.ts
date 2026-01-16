import { ipcMain } from 'electron';
import { getDatabase } from '../database';
import { randomUUID } from 'crypto';

export const setupEventHandlers = (): void => {
  // Create event
  ipcMain.handle('event:create', (_event, eventData) => {
    const db = getDatabase();
    const id = randomUUID();
    const now = Date.now();

    const insert = db.prepare(`
      INSERT INTO events (
        id, title, description, color, sound_file, sound_volume,
        recurrence_rule, start_date, end_date,
        is_enabled, priority, tags,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      eventData.title,
      eventData.description || null,
      eventData.color,
      eventData.soundFile || null,
      eventData.soundVolume || 1.0,
      eventData.recurrenceRule,
      eventData.startDate,
      eventData.endDate || null,
      eventData.isEnabled ? 1 : 0,
      eventData.priority || 0,
      JSON.stringify(eventData.tags || []),
      now,
      now
    );

    return { id, ...eventData, createdAt: now, updatedAt: now };
  });

  // Get all events
  ipcMain.handle('event:get-all', () => {
    const db = getDatabase();
    const events = db.prepare('SELECT * FROM events ORDER BY created_at DESC').all();
    return events.map(parseEvent);
  });

  // Get single event
  ipcMain.handle('event:get', (_event, id: string) => {
    const db = getDatabase();
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    return event ? parseEvent(event) : null;
  });

  // Update event
  ipcMain.handle('event:update', (_event, id: string, eventData) => {
    const db = getDatabase();
    const now = Date.now();

    const update = db.prepare(`
      UPDATE events SET
        title = ?,
        description = ?,
        color = ?,
        sound_file = ?,
        sound_volume = ?,
        recurrence_rule = ?,
        start_date = ?,
        end_date = ?,
        is_enabled = ?,
        priority = ?,
        tags = ?,
        updated_at = ?
      WHERE id = ?
    `);

    update.run(
      eventData.title,
      eventData.description || null,
      eventData.color,
      eventData.soundFile || null,
      eventData.soundVolume || 1.0,
      eventData.recurrenceRule,
      eventData.startDate,
      eventData.endDate || null,
      eventData.isEnabled ? 1 : 0,
      eventData.priority || 0,
      JSON.stringify(eventData.tags || []),
      now,
      id
    );

    return { id, ...eventData, updatedAt: now };
  });

  // Delete event
  ipcMain.handle('event:delete', (_event, id: string) => {
    const db = getDatabase();
    db.prepare('DELETE FROM events WHERE id = ?').run(id);
    return true;
  });

  // Get upcoming occurrences
  ipcMain.handle('event:get-upcoming', (_event, hours: number) => {
    // This will be implemented with rrule in Phase 2
    return [];
  });

  // Get active occurrences
  ipcMain.handle('event:get-active', () => {
    // This will be implemented with rrule in Phase 2
    return [];
  });

  // Get recent occurrences
  ipcMain.handle('event:get-recent', (_event, hours: number) => {
    // This will be implemented with rrule in Phase 2
    return [];
  });
};

// Helper to parse database row to event object
const parseEvent = (row: any) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  color: row.color,
  soundFile: row.sound_file,
  soundVolume: row.sound_volume,
  recurrenceRule: row.recurrence_rule,
  startDate: row.start_date,
  endDate: row.end_date,
  isEnabled: row.is_enabled === 1,
  priority: row.priority,
  tags: JSON.parse(row.tags || '[]'),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastTriggered: row.last_triggered,
});
