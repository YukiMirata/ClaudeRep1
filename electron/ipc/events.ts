import { ipcMain } from 'electron';
import { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent } from '../database';
import { randomUUID } from 'crypto';

export const setupEventHandlers = (): void => {
  // Create event
  ipcMain.handle('event:create', async (_event, eventData) => {
    const id = randomUUID();
    const now = Date.now();

    const newEvent = {
      id,
      title: eventData.title,
      description: eventData.description,
      color: eventData.color,
      soundFile: eventData.soundFile,
      soundVolume: eventData.soundVolume || 1.0,
      recurrenceRule: eventData.recurrenceRule,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      isEnabled: eventData.isEnabled !== false,
      priority: eventData.priority || 0,
      tags: eventData.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    await createEvent(newEvent);
    return newEvent;
  });

  // Get all events
  ipcMain.handle('event:get-all', async () => {
    const events = await getAllEvents();
    return events;
  });

  // Get single event
  ipcMain.handle('event:get', async (_event, id: string) => {
    const event = await getEventById(id);
    return event || null;
  });

  // Update event
  ipcMain.handle('event:update', async (_event, id: string, eventData) => {
    const updatedEvent = await updateEvent(id, eventData);
    return updatedEvent;
  });

  // Delete event
  ipcMain.handle('event:delete', async (_event, id: string) => {
    const result = await deleteEvent(id);
    return result;
  });

  // Get upcoming occurrences
  ipcMain.handle('event:get-upcoming', async (_event, hours: number) => {
    // This will be implemented with rrule in frontend
    return [];
  });

  // Get active occurrences
  ipcMain.handle('event:get-active', async () => {
    // This will be implemented with rrule in frontend
    return [];
  });

  // Get recent occurrences
  ipcMain.handle('event:get-recent', async (_event, hours: number) => {
    // This will be implemented with rrule in frontend
    return [];
  });
};
