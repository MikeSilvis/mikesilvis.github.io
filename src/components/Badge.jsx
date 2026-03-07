import styles from './Badge.module.css';

const VARIANT_MAP = {
  accent: styles.accent,
  blue: styles.blue,
  green: styles.green,
  red: styles.red,
  yellow: styles.yellow,
};

export default function Badge({ children, variant = 'accent', className }) {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.accent;

  return (
    <span className={`${styles.badge} ${variantClass}${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}
