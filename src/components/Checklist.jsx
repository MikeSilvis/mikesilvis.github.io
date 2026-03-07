import { useState, useEffect, useCallback } from 'react';
import styles from './Checklist.module.css';

function loadChecked(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function Checklist({ storageKey, items, onProgressChange }) {
  const [checked, setChecked] = useState(() => loadChecked(storageKey));

  const notifyProgress = useCallback(
    (state) => {
      if (!onProgressChange) return;
      const done = Object.values(state).filter(Boolean).length;
      const total = items.length;
      onProgressChange({ done, total, percent: total ? Math.round((done / total) * 100) : 0 });
    },
    [items.length, onProgressChange],
  );

  useEffect(() => {
    notifyProgress(checked);
  }, [checked, notifyProgress]);

  const toggle = (index) => {
    setChecked((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // storage full or unavailable
      }
      return next;
    });
  };

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const isChecked = !!checked[i];
        return (
          <div
            key={i}
            className={styles.row}
            role="checkbox"
            aria-checked={isChecked}
            tabIndex={0}
            onClick={() => toggle(i)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggle(i);
              }
            }}
          >
            <div className={`${styles.checkbox}${isChecked ? ` ${styles.checkboxChecked}` : ''}`}>
              {isChecked && (
                <svg
                  className={styles.checkmark}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <div className={styles.content}>
              <div className={`${styles.title}${isChecked ? ` ${styles.titleChecked}` : ''}`}>
                {item.title}
              </div>
              {item.note && <div className={styles.note}>{item.note}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
