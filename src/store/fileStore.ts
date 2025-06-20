import { create } from 'zustand';
import type { AggregateChunk } from '../api/agregate.ts';

interface FileState {
  file?: File;
  data?: AggregateChunk;
  status?: 'parsing' | 'success' | 'error';
  error?: string;
  setFile: (file?: File) => void;
  setStatus: (status: FileState['status']) => void;
  setError: (msg?: string) => void;
  setData: (data?: AggregateChunk) => void;
}

export const useFileStore = create<FileState>((set) => ({
  file: undefined,
  data: undefined,
  status: undefined,
  error: undefined,
  setFile: (file) => set({ file }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setData: (data) => set({ data }),
}));
