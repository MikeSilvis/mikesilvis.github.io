import React from 'react';
import styles from '../Wrestling.module.css';

export default function WeightPills({ weights, activeWeight, onSelect }) {
  return (
    <div className={styles.weightPills}>
      {weights.map((w) => (
        <button
          key={w}
          className={`${styles.weightPill}${activeWeight === w ? ` ${styles.weightPillActive}` : ''}`}
          onClick={() => onSelect(w)}
        >
          {w}
        </button>
      ))}
    </div>
  );
}
