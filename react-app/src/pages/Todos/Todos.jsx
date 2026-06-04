import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTodos } from '../../hooks/useTodos';
import TodoList from '../../components/todo/TodoList';
import Modal from '../../components/common/Modal';
import TodoForm from '../../components/todo/TodoForm';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { TODO_STATUS } from '../../utils/constants';
import styles from './Todos.module.css';

export default function Todos() {
  const navigate = useNavigate();
  const location = useLocation();
  const editTodo = location.state?.editTodo;

  const { todos, loading, fetchTodos, updateTodo, deleteTodo, createTodo } = useTodos();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTodos = useCallback(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    if (editTodo) {
      setEditingTodo(editTodo);
      setModalOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [editTodo, navigate, location.pathname]);

  const filtered = todos.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  const handleDeleteRequest = (todo) => {
    setDeleteTarget(todo);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await deleteTodo(deleteTarget.id);
    } catch {
    } finally {
      setSubmitting(false);
      setDeleteTarget(null);
    }
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, data);
      } else {
        await createTodo(data);
      }
      setModalOpen(false);
      setEditingTodo(null);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const openCreate = () => {
    setEditingTodo(null);
    setModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/dashboard" className={styles.back}>Back to Dashboard</Link>
        <h1 className={styles.title}>Todos</h1>
        <Button onClick={openCreate}>Create Todo</Button>
      </header>

      <div className={styles.filters}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {Object.values(TODO_STATUS).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && todos.length === 0 ? (
        <Loader />
      ) : (
        <TodoList todos={filtered} onEdit={handleEdit} onDelete={handleDeleteRequest} />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTodo(null); }}
        title={editingTodo ? 'Edit Todo' : 'Create Todo'}
      >
        <TodoForm
          defaultValues={editingTodo}
          onSubmit={handleFormSubmit}
          loading={submitting}
          onCancel={() => { setModalOpen(false); setEditingTodo(null); }}
        />
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Todo"
      >
        <p className={styles.confirmText}>
          Are you sure you want to delete "{deleteTarget?.title}"?
        </p>
        <div className={styles.confirmActions}>
          <Button variant="danger" onClick={handleDeleteConfirm} loading={submitting}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
