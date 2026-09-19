import type { Credentials } from '../api/types';

const CREDENTIALS_KEY = 'green-api-credentials';

export const saveCredentials = (credentials: Credentials): void => {
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error('Failed to save credentials to localStorage:', error);
  }
};

export const loadCredentials = (): Credentials | null => {
  try {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse credentials from localStorage:', error);
    return null;
  }
};

export const clearCredentials = (): void => {
  try {
    localStorage.removeItem(CREDENTIALS_KEY);
  } catch (error) {
    console.error('Failed to remove credentials from localStorage:', error);
  }
};
