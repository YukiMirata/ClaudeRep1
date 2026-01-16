import { create } from 'zustand';
import { Event, CreateEventData } from '../types/event';

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchEvents: () => Promise<void>;
  createEvent: (eventData: CreateEventData) => Promise<Event>;
  updateEvent: (id: string, eventData: Partial<CreateEventData>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  toggleEventEnabled: (id: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const events = await window.electronAPI.getEvents();
      set({ events, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createEvent: async (eventData: CreateEventData) => {
    set({ loading: true, error: null });
    try {
      const newEvent = await window.electronAPI.createEvent(eventData);
      set((state) => ({
        events: [newEvent, ...state.events],
        loading: false,
      }));
      return newEvent;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateEvent: async (id: string, eventData: Partial<CreateEventData>) => {
    set({ loading: true, error: null });
    try {
      const updatedEvent = await window.electronAPI.updateEvent(id, eventData);
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
        loading: false,
      }));
      return updatedEvent;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await window.electronAPI.deleteEvent(id);
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  toggleEventEnabled: async (id: string) => {
    const event = get().events.find((e) => e.id === id);
    if (!event) return;

    await get().updateEvent(id, { isEnabled: !event.isEnabled });
  },

  refreshEvents: async () => {
    await get().fetchEvents();
  },
}));
