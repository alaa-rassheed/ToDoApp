import client from './client';

export const getTodosApi = () => client.get('/todos');

export const createTodoApi = (data) => client.post('/todos', data);

export const updateTodoApi = (id, data) => client.put(`/todos/${id}`, data);

export const deleteTodoApi = (id) => client.delete(`/todos/${id}`);
