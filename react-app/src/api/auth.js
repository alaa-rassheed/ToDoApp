import client from './client';

export const loginApi = (data) => client.post('/auth/login', data);

export const signupApi = (data) => client.post('/auth/signup', data);

export const getMeApi = () => client.get('/auth/me');

export const logoutApi = () => client.post('/auth/logout');
