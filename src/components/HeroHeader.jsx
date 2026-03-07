import styles from './HeroHeader.module.css';

export default function HeroHeader({
  badge,
  title,
  subtitle,
  stats,
  accentColor,
  backgroundPattern = 'stripes',
}) {
  const patternClass = backgroundPattern === 'circles' ? styles.circles : styles.stripes;

  const headerStyle = accentColor
    ? { '--accent': accentColor }
    : undefined;

  const titleStyle = {
    background: `linear-gradient(135deg, #fff 30%, ${accentColor || 'var(--blue)'} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <header
      className={`${styles.header} ${patternClass}`}
      style={headerStyle}
    >
      {badge && <div className={styles.badge}>{badge}</div>}

      <h1
        className={styles.title}
        style={titleStyle}
        dangerouslySetInnerHTML={{ __html: title }}
      />

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      {stats && stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map((s, i) => (
            <div key={i} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
