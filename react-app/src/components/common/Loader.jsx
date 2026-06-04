import styles from './Loader.module.css';

export default function Loader({ size = 'md' }) {
  return (
    <div className={`${styles.wrapper} ${styles[size]}`}>
      <div className={styles.spinner} />
    </div>
  );
}
