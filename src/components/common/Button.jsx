import styles from './Button.module.css';

export default function Button({ children, variant = 'primary', type = 'button', loading, disabled, onClick, className = '' }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
