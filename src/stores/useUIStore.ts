import { create } from 'zustand';

type Page = 'events' | 'timeline' | 'settings';

interface UIState {
  currentPage: Page;
  isEventFormOpen: boolean;
  selectedEventId: string | null;

  // Actions
  setCurrentPage: (page: Page) => void;
  openEventForm: (eventId?: string) => void;
  closeEventForm: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentPage: 'timeline',
  isEventFormOpen: false,
  selectedEventId: null,

  setCurrentPage: (page: Page) => {
    set({ currentPage: page });
  },

  openEventForm: (eventId?: string) => {
    set({
      isEventFormOpen: true,
      selectedEventId: eventId || null,
    });
  },

  closeEventForm: () => {
    set({
      isEventFormOpen: false,
      selectedEventId: null,
    });
  },
}));
