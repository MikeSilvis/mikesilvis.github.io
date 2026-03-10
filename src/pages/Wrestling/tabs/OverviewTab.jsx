import React from 'react';
import InfoGrid from '../../../components/InfoGrid';
import styles from '../Wrestling.module.css';
import { computeLiveStandings } from '../hooks/useLiveResults';

const INFO_ITEMS = [
  { label: 'Location', value: 'BJC', note: 'Bryce Jordan Center, State College, PA' },
  { label: 'Dates', value: 'Mar 7-8', note: 'Saturday & Sunday, 2026' },
  { label: 'Sessions', value: '5', note: '3 Saturday, 2 Sunday' },
  { label: 'Broadcast', value: 'BTN / B1G+', note: 'Big Ten Network & B1G+ streaming' },
  { label: 'Teams', value: '14', note: 'All Big Ten wrestling programs' },
  { label: 'Weight Classes', value: '125-285', note: '10 NCAA weight classes' },
];

export default function OverviewTab({ liveResults, liveDataLoaded }) {
  const standings = liveDataLoaded ? computeLiveStandings(liveResults) : [];
  const maxScore = standings.length > 0 ? (standings[0].score || 1) : 1;

  return (
    <>
      <h2 className={styles.sectionTitle}>
        Tournament <span>Overview</span>
      </h2>
      <p className={styles.sectionIntro}>
        The 112th Big Ten Wrestling Championships returns to Penn State's Bryce Jordan Center.
        Fourteen teams compete across ten weight classes over two action-packed days.
      </p>

      <div className={styles.hashtagBar}>
        <a
          className={styles.hashtag}
          href="https://www.instagram.com/explore/tags/B1GWrestling/"
          target="_blank"
          rel="noopener"
        >
          #B1GWrestling
        </a>
        <a
          className={styles.hashtag}
          href="https://www.instagram.com/explore/tags/B1GWrestle/"
          target="_blank"
          rel="noopener"
        >
          #B1GWrestle
        </a>
        <a
          className={styles.hashtag}
          href="https://www.instagram.com/b1gwrestling/"
          target="_blank"
          rel="noopener"
        >
          @b1gwrestling
        </a>
      </div>

      <InfoGrid items={INFO_ITEMS} accentColor="#c4a44a" />

      {liveDataLoaded && standings.length > 0 && (
        <div className={styles.standingsSection}>
          <h3 className={styles.sectionTitle} style={{ fontSize: '2rem' }}>
            Final <span>Standings</span>
          </h3>
          <p className={styles.sectionIntro}>
            Team scores computed from tournament results.
          </p>
          <div className={styles.standings}>
            {standings.map((s, i) => (
              <div key={s.team} className={styles.standingRow}>
                <div className={styles.standingRank}>{i + 1}</div>
                <div className={styles.standingTeam}>{s.team}</div>
                <div className={styles.standingScore}>{s.score.toFixed(1)}</div>
                <div className={styles.standingBar}>
                  <div
                    className={styles.standingBarFill}
                    style={{ width: `${(s.score / maxScore * 100).toFixed(1)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
