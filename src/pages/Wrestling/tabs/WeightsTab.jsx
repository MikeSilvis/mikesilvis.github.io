import React, { useState } from 'react';
import { WEIGHT_CLASSES } from '../data/weightClasses';
import WeightPills from '../components/WeightPills';
import { buildSeededBracket, buildLiveBracket } from '../components/Bracket';
import WrestlerCard from '../components/WrestlerCard';
import { findLiveRecord, getWrestlerResults } from '../hooks/useLiveResults';
import styles from '../Wrestling.module.css';

const WEIGHTS = Object.keys(WEIGHT_CLASSES).map(Number);
const TOURNAMENT_ID = '964607132';
const RESULTS_URL = 'https://www.trackwrestling.com/BracketViewer/pt/' + TOURNAMENT_ID;

export default function WeightsTab({ liveResults, liveDataLoaded }) {
  const [activeWeight, setActiveWeight] = useState(125);

  const data = WEIGHT_CLASSES[activeWeight];
  if (!data) return null;

  const w = data.wrestlers;
  const live = liveResults[activeWeight] || {};
  const hasLive = liveDataLoaded && (live.qf && live.qf.length > 0);

  // Build wrestler data with live records
  const wrestlerData = w.map(wr => {
    const liveRecord = findLiveRecord(wr.name, live);
    return { ...wr, record: liveRecord || wr.record };
  });

  return (
    <>
      <h2 className={styles.sectionTitle}>
        Weight <span>Classes</span>
        {liveDataLoaded && (
          <span className={styles.liveBadge}>LIVE RESULTS</span>
        )}
      </h2>
      <p className={styles.sectionIntro}>
        Select a weight class to view the bracket and wrestler profiles.
        Results update live from TrackWrestling.
      </p>

      <WeightPills
        weights={WEIGHTS}
        activeWeight={activeWeight}
        onSelect={setActiveWeight}
      />

      {hasLive
        ? buildLiveBracket(w, live)
        : buildSeededBracket(w)
      }

      {hasLive && (
        <div className={styles.dataSource}>
          Results via{' '}
          <a href={RESULTS_URL} target="_blank" rel="noopener">
            TrackWrestling
          </a>
        </div>
      )}

      <h3 className={styles.sectionTitle} style={{ fontSize: '1.8rem', marginTop: '1rem' }}>
        Wrestler <span>Profiles</span>
      </h3>
      <div className={styles.wrestlerGrid}>
        {wrestlerData.map((wr) => (
          <WrestlerCard
            key={`${activeWeight}-${wr.seed}`}
            wrestler={wr}
            results={getWrestlerResults(wr.name, live)}
          />
        ))}
      </div>
    </>
  );
}
