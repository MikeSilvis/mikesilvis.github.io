import styles from './StickyTabNav.module.css';

export default function StickyTabNav({ tabs, activeTab, onTabChange, accentColor }) {
  const navStyle = accentColor ? { '--accent': accentColor } : undefined;

  return (
    <nav className={styles.nav} style={navStyle}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab}${activeTab === tab.id ? ` ${styles.tabActive}` : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
