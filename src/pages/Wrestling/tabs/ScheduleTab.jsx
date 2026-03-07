import React, { useState } from 'react';
import { SCHEDULE } from '../data/schedule';
import styles from '../Wrestling.module.css';

export default function ScheduleTab() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggle = (i) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>
        Tournament <span>Schedule</span>
      </h2>
      <p className={styles.sectionIntro}>
        Five sessions across two days. All times Eastern.
      </p>
      <div>
        {SCHEDULE.map((s, i) => (
          <div
            key={i}
            className={`${styles.sessionCard}${expandedIndex === i ? ` ${styles.sessionCardExpanded}` : ''}`}
            onClick={() => toggle(i)}
          >
            <div className={styles.sessionHeader}>
              <div>
                <div className={styles.sessionLabel}>
                  {s.label} &mdash; {s.day}
                </div>
                <div className={styles.sessionTime}>{s.time}</div>
              </div>
              <div className={styles.sessionChevron}>&#9660;</div>
            </div>
            <div className={styles.sessionBody}>
              <div className={styles.sessionContent}>
                <strong>{s.rounds}</strong>
                <br />
                {s.details}
                <br />
                <span className={styles.sessionBroadcast}>{s.broadcast}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
