import client from '../api/client';

export const authService = {
  login: (data) => client.post('/auth/login', data),
  getMe: () => client.get('/auth/me'),
  logout: () => client.post('/auth/logout'),
};
