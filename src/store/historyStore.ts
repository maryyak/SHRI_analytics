import { create } from 'zustand';
import type { AggregateChunk } from '../api/agregate.ts';

const STORAGE_KEY = 'history';

export interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  status: 'success' | 'error';
  errorMessage?: string;
  data?: AggregateChunk;
}

interface HistoryState {
  items: HistoryItem[];
  load: () => void;
  add: (item: HistoryItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  items: [],

  load: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list: HistoryItem[] = [];
    if (raw) {
      try {
        list = JSON.parse(raw) as HistoryItem[];
      } catch (err) {
        console.error(err);
      }
    }
    set({ items: list });
  },

  add: (item) => {
    const items = [item, ...get().items];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    set({ items });
  },

  remove: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    set({ items });
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ items: [] });
  },
}));
