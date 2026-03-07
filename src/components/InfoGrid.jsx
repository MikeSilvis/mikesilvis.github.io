import styles from './InfoGrid.module.css';

export default function InfoGrid({ items, accentColor }) {
  const gridStyle = accentColor ? { '--accent': accentColor } : undefined;

  return (
    <div className={styles.grid} style={gridStyle}>
      {items.map((item, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.label}>{item.label}</div>
          <div className={styles.value}>{item.value}</div>
          {item.note && <div className={styles.note}>{item.note}</div>}
        </div>
      ))}
    </div>
  );
}
