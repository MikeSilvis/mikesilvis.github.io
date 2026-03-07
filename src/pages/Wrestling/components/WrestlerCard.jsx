import React, { useState } from 'react';
import styles from '../Wrestling.module.css';

export default function WrestlerCard({ wrestler, results }) {
  const [expanded, setExpanded] = useState(false);
  const initials = wrestler.name.split(' ').map(n => n[0]).join('');

  return (
    <div
      className={`${styles.wrestlerCard}${expanded ? ` ${styles.wrestlerCardExpanded}` : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className={styles.wrestlerHeader}>
        <div className={styles.wrestlerPhotoWrap}>
          {wrestler.img ? (
            <>
              <img
                className={styles.wrestlerPhoto}
                src={wrestler.img}
                alt={wrestler.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <span className={styles.wrestlerPhotoFallback} style={{ display: 'none' }}>
                {initials}
              </span>
            </>
          ) : (
            <span className={styles.wrestlerPhotoFallback}>{initials}</span>
          )}
          <div className={styles.wrestlerSeedBadge}>{wrestler.seed}</div>
        </div>
        <div className={styles.wrestlerInfo}>
          <div className={styles.wrestlerName}>{wrestler.name}</div>
          <div className={styles.wrestlerSchool}>{wrestler.school}</div>
        </div>
        <div className={styles.wrestlerRecord}>{wrestler.record}</div>
        <div className={styles.wrestlerExpandIcon}>&#9660;</div>
      </div>
      <div className={styles.wrestlerBody}>
        <div className={styles.wrestlerBio}>
          <span className={styles.wrestlerRankBadge}>{wrestler.rank} nationally</span>
          {results && results.length > 0 && results.map((r, i) => (
            <span
              key={i}
              className={`${styles.wrestlerResultBadge} ${r.won ? styles.wrestlerResultWin : styles.wrestlerResultLoss}`}
            >
              {r.won ? 'W' : 'L'} {r.method}
            </span>
          ))}
          <br />
          {wrestler.bio}
          {wrestler.ig && (
            <>
              <br />
              <a
                className={styles.wrestlerIgLink}
                href={`https://instagram.com/${wrestler.ig.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                &#9758; {wrestler.ig}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
