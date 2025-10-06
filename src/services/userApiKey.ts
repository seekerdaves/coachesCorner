// User API Key Management
// This allows each user to provide their own Gemini API key
// Keys are stored in localStorage (not hardcoded in the app)

const API_KEY_STORAGE_KEY = 'bowling-coach-user-api-key';

export const saveUserApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const getUserApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const clearUserApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

export const hasUserApiKey = (): boolean => {
  return !!getUserApiKey();
};
