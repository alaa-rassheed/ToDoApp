import { useState, useCallback } from 'react';
import { getTodosApi, createTodoApi, updateTodoApi, deleteTodoApi } from '../api/todos';

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTodosApi();
      setTodos(res.data.todos || res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (data) => {
    setError(null);
    try {
      const res = await createTodoApi(data);
      await fetchTodos();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create todo');
      throw err;
    }
  }, [fetchTodos]);

  const updateTodo = useCallback(async (id, data) => {
    setError(null);
    try {
      const res = await updateTodoApi(id, data);
      await fetchTodos();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo');
      throw err;
    }
  }, [fetchTodos]);

  const deleteTodo = useCallback(async (id) => {
    setError(null);
    try {
      await deleteTodoApi(id);
      await fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo');
      throw err;
    }
  }, [fetchTodos]);

  return { todos, loading, error, fetchTodos, createTodo, updateTodo, deleteTodo };
}
