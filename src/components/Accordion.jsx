import { useState } from 'react';
import styles from './Accordion.module.css';

export default function Accordion({ items }) {
  const [openIndices, setOpenIndices] = useState(new Set());

  const toggle = (index) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, i) => {
        const isOpen = openIndices.has(i);
        return (
          <div key={i} className={styles.item}>
            <button
              className={styles.header}
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <span>{item.header}</span>
              <svg
                className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isOpen && <div className={styles.body}>{item.body}</div>}
          </div>
        );
      })}
    </div>
  );
}
