import client from '../api/client';

export const todoService = {
  getAll: () => client.get('/todos'),
  create: (data) => client.post('/todos', data),
  update: (id, data) => client.put(`/todos/${id}`, data),
  delete: (id) => client.delete(`/todos/${id}`),
};
