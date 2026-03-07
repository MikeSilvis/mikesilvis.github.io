import styles from './ProgressBar.module.css';

export default function ProgressBar({ value, height = '6px', className }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`${styles.track}${className ? ` ${className}` : ''}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
}
