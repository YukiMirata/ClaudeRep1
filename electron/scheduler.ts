import { BrowserWindow } from 'electron';
import { getAllEvents } from './database';
import { rrulestr } from 'rrule';

interface TriggeredEvent {
  eventId: string;
  occurrenceTime: number;
}

export class EventScheduler {
  private checkInterval: NodeJS.Timeout | null = null;
  private CHECK_INTERVAL_MS = 10000; // Check every 10 seconds
  private window: BrowserWindow;
  private lastCheck: number = Date.now();
  private triggeredEvents: Set<string> = new Set(); // Track what we've already triggered

  constructor(window: BrowserWindow) {
    this.window = window;
  }

  start(): void {
    console.log('Event scheduler started - checking every 10 seconds');

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
      const checkStart = this.lastCheck;
      const checkEnd = now;

      // Get all enabled events
      const allEvents = await getAllEvents();
      const enabledEvents = allEvents.filter(e => e.isEnabled);

      for (const event of enabledEvents) {
        try {
          // Parse recurrence rule
          const rule = rrulestr(event.recurrenceRule);

          // Get occurrences in the time window we're checking
          const occurrences = rule.between(
            new Date(checkStart),
            new Date(checkEnd),
            true // inclusive
          );

          // Trigger each occurrence
          for (const occurrence of occurrences) {
            const occurrenceTime = occurrence.getTime();
            const eventKey = `${event.id}-${occurrenceTime}`;

            // Only trigger if we haven't already triggered this specific occurrence
            if (!this.triggeredEvents.has(eventKey)) {
              this.triggeredEvents.add(eventKey);

              console.log(`🔔 Triggering event: "${event.title}" at ${occurrence.toLocaleString()}`);

              // Send to renderer process
              this.window.webContents.send('event:triggered', {
                id: eventKey,
                event: event,
                occurrenceTime: occurrenceTime,
              });

              // Clean up old triggered events (keep last hour only)
              this.cleanupTriggeredEvents(now);
            }
          }
        } catch (error) {
          console.error(`Error processing event "${event.title}":`, error);
        }
      }

      this.lastCheck = now;
    } catch (error) {
      console.error('Error checking for due events:', error);
    }
  }

  private cleanupTriggeredEvents(now: number): void {
    const oneHourAgo = now - (60 * 60 * 1000);

    // Remove triggered events older than 1 hour
    const keysToDelete: string[] = [];
    this.triggeredEvents.forEach(key => {
      const parts = key.split('-');
      const timestamp = parseInt(parts[parts.length - 1]);
      if (timestamp < oneHourAgo) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.triggeredEvents.delete(key));
  }

  // Allow manual trigger for testing
  public async triggerTestEvent(): Promise<void> {
    const allEvents = await getAllEvents();
    if (allEvents.length > 0) {
      const testEvent = allEvents[0];
      const now = Date.now();

      console.log(`🧪 Manually triggering test event: "${testEvent.title}"`);

      this.window.webContents.send('event:triggered', {
        id: `test-${now}`,
        event: testEvent,
        occurrenceTime: now,
      });
    }
  }
}
