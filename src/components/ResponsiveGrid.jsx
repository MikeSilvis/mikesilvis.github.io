import styles from './ResponsiveGrid.module.css';

export default function ResponsiveGrid({
  minWidth = '200px',
  gap = '1rem',
  children,
  className,
  style,
}) {
  return (
    <div
      className={`${styles.grid}${className ? ` ${className}` : ''}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
