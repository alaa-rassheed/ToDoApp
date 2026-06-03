import { STORAGE_KEYS } from './constants';

export const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

export const setToken = (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token);

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};
