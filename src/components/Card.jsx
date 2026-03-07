import styles from './Card.module.css';

export default function Card({ icon, title, children, className, style }) {
  return (
    <div
      className={`${styles.card}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {(icon || title) && (
        <div className={styles.header}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {title && <h3 className={styles.title}>{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
}
