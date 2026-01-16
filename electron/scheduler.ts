import { BrowserWindow } from 'electron';
import { getAllEvents } from './database';

export class EventScheduler {
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 30000; // 30 seconds
  private window: BrowserWindow;

  constructor(window: BrowserWindow) {
    this.window = window;
  }

  start(): void {
    console.log('Event scheduler started');

    // Initial check
    this.checkForDueEvents();

    // Set up recurring checks
    this.checkInterval = setInterval(() => {
      this.checkForDueEvents();
    }, this.CHECK_INTERVAL_MS);
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log('Event scheduler stopped');
  }

  private async checkForDueEvents(): Promise<void> {
    try {
      const now = Date.now();

      // Get all enabled events
      const allEvents = await getAllEvents();
      const events = allEvents.filter(
        e => e.isEnabled && e.startDate <= now && (!e.endDate || e.endDate >= now)
      );

      // For now, just log - we'll implement full recurrence checking later
      if (events.length > 0) {
        console.log(`Checking ${events.length} active events`);
      }

      // Notify renderer of updates
      this.window.webContents.send('event:updated');
    } catch (error) {
      console.error('Error checking for due events:', error);
    }
  }
}
