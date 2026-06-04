import { TODO_STATUS } from '../../utils/constants';
import { formatDate, getStatusColor } from '../../utils/helpers';
import styles from './TodoCard.module.css';

export default function TodoCard({ todo, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{todo.title}</h3>
        <span
          className={styles.status}
          style={{ background: getStatusColor(todo.status), color: '#fff' }}
        >
          {todo.status}
        </span>
      </div>
      {todo.description && <p className={styles.desc}>{todo.description}</p>}
      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(todo.createdAt)}</span>
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => onEdit(todo)}>Edit</button>
          <button className={styles.deleteBtn} onClick={() => onDelete(todo)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
