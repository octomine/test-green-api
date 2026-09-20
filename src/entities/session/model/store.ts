import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Credentials } from '@/shared/api';

interface SessionState {
  credentials: Credentials | null;
  setCredentials: (credentials: Credentials) => void;
  clearCredentials: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      credentials: null,
      setCredentials: (credentials) => set({ credentials }),
      clearCredentials: () => set({ credentials: null }),
    }),
    {
      name: 'green-api-credentials',
      partialize: (state) => ({ credentials: state.credentials }),
    },
  ),
);
