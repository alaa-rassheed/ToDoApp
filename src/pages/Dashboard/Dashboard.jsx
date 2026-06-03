import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTodos } from '../../hooks/useTodos';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { TODO_STATUS } from '../../utils/constants';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { todos, loading, fetchTodos } = useTodos();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.status === TODO_STATUS.COMPLETED).length;
  const pendingTodos = todos.filter((t) => t.status === TODO_STATUS.PENDING).length;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  if (loading && todos.length === 0) return <Loader />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Welcome, {user?.name || 'User'}</h1>
        <div className={styles.headerActions}>
          <Link to="/todos">
            <Button variant="secondary">View Todos</Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} loading={loggingOut}>
            Logout
          </Button>
        </div>
      </header>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalTodos}</span>
          <span className={styles.statLabel}>Total Todos</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{completedTodos}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{pendingTodos}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
      </div>

      <Link to="/todos/new" className={styles.createLink}>
        <Button>Create New Todo</Button>
      </Link>
    </div>
  );
}
