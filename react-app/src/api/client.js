import axios from 'axios';
import { getToken, clearStorage } from '../utils/storage';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

const isMock = import.meta.env.VITE_USE_MOCK === 'true';

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStorage();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

if (isMock) {
  import('./mock.js').then(({ setupMock }) => setupMock(client));
}

export default client;
