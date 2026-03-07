import styles from './PageShell.module.css';

export default function PageShell({ children, className }) {
  return (
    <div className={`${styles.shell}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
