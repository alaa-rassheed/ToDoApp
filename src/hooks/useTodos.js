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
    setLoading(true);
    setError(null);
    try {
      const res = await createTodoApi(data);
      setTodos((prev) => [...prev, res.data.todo || res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create todo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTodo = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateTodoApi(id, data);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? (res.data.todo || res.data) : t))
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTodoApi(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { todos, loading, error, fetchTodos, createTodo, updateTodo, deleteTodo };
}
