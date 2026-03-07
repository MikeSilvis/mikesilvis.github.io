import React, { useState } from 'react';
import { TEAMS } from '../data/teams';
import { getTeamRoster } from '../hooks/useLiveResults';
import styles from '../Wrestling.module.css';

function TeamCard({ team }) {
  const [expanded, setExpanded] = useState(false);
  const roster = getTeamRoster(team.name);

  return (
    <div
      className={`${styles.teamCard}${expanded ? ` ${styles.teamCardExpanded}` : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className={styles.teamHeader}>
        <div className={styles.teamInitial} style={{ background: team.color }}>
          {team.initial}
        </div>
        <div className={styles.teamInfo}>
          <div className={styles.teamName}>{team.name}</div>
          <div className={styles.teamLocation}>{team.location}</div>
        </div>
        <div className={styles.teamExpandIcon}>&#9660;</div>
      </div>
      <div className={styles.teamBody}>
        <div className={styles.teamDetail}>
          {roster.length > 0 && (
            <div className={styles.teamWrestlers}>
              {roster.map((r) => (
                <div key={r.name} className={styles.teamWrestlerRow}>
                  <div className={styles.teamWrestlerPic}>
                    {r.img ? (
                      <img src={r.img} alt={r.name} loading="lazy" />
                    ) : (
                      <div className={styles.teamWrestlerPicPlaceholder}>
                        {r.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div className={styles.teamWrestlerInfo}>
                    <div className={styles.teamWrestlerName}>{r.name}</div>
                    <div className={styles.teamWrestlerMeta}>
                      {r.weight} &bull; #{r.seed} seed &bull; {r.record}
                    </div>
                    {r.ig && (
                      <a
                        className={styles.teamWrestlerIg}
                        href={r.igUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {r.ig}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <a
            className={styles.teamIgLink}
            href={team.igUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {team.ig}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TeamsTab() {
  return (
    <>
      <h2 className={styles.sectionTitle}>
        The <span>Teams</span>
      </h2>
      <p className={styles.sectionIntro}>
        All 14 Big Ten wrestling programs competing for the conference title.
      </p>
      <div className={styles.teamsGrid}>
        {TEAMS.map((t) => (
          <TeamCard key={t.abbr} team={t} />
        ))}
      </div>
    </>
  );
}
