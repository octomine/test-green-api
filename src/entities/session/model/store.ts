import { create } from 'zustand';
import type { Credentials } from '@/shared/api';
import {
  loadCredentials,
  saveCredentials as saveStoredCredentials,
  clearCredentials as clearStoredCredentials,
} from '@/shared/lib';

interface SessionState {
  credentials: Credentials | null;
  setCredentials: (credentials: Credentials) => void;
  clearCredentials: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  credentials: loadCredentials(),
  setCredentials: (credentials: Credentials) => {
    saveStoredCredentials(credentials);
    set({ credentials });
  },
  clearCredentials: () => {
    clearStoredCredentials();
    set({ credentials: null });
  },
}));
