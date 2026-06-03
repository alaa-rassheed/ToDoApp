import TodoCard from './TodoCard';
import styles from './TodoList.module.css';

export default function TodoList({ todos, onEdit, onDelete }) {
  if (todos.length === 0) {
    return <p className={styles.empty}>No todos found</p>;
  }

  return (
    <div className={styles.list}>
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
