import React, { useState } from 'react';
import { WEIGHT_CLASSES } from '../data/weightClasses';
import { TEAMS } from '../data/teams';
import styles from '../Wrestling.module.css';

const WEIGHTS = Object.keys(WEIGHT_CLASSES).map(Number);
const ROUND_LABELS = {
  qf: 'Quarterfinals',
  sf: 'Semifinals',
  finals: 'Finals',
};
const ROUND_ORDER = ['qf', 'sf', 'finals'];

function findWrestlerData(name, weight) {
  const data = WEIGHT_CLASSES[weight];
  if (!data) return null;
  return data.wrestlers.find(w => w.name === name) || null;
}

function getMatchStatus(match) {
  if (match.winner && match.winner.name && match.winner.name !== 'TBD' && match.method) {
    return 'completed';
  }
  if (match.winner && match.winner.name && match.winner.name !== 'TBD' && !match.method) {
    return 'active';
  }
  return 'upcoming';
}

function buildAllMatches(liveResults) {
  const active = [];
  const upcoming = [];
  const completed = [];

  for (const weight of WEIGHTS) {
    const live = liveResults[weight];
    if (!live) continue;

    for (const round of ROUND_ORDER) {
      const matches = live[round];
      if (!matches) continue;

      for (const match of matches) {
        const status = getMatchStatus(match);
        const entry = { weight, round, match, status };
        if (status === 'active') active.push(entry);
        else if (status === 'upcoming') upcoming.push(entry);
        else completed.push(entry);
      }
    }
  }

  return { active, upcoming, completed };
}

function buildUpcomingFromSeeds(liveResults) {
  const upcoming = [];

  for (const weight of WEIGHTS) {
    const live = liveResults[weight];
    const data = WEIGHT_CLASSES[weight];
    if (!data) continue;

    const hasQf = live && live.qf && live.qf.length > 0;

    if (!hasQf) {
      // Show seeded QF matchups as upcoming
      const w = data.wrestlers;
      const qfPairings = [
        [w[0], w[7]], // 1 vs 8
        [w[3], w[4]], // 4 vs 5
        [w[2], w[5]], // 3 vs 6
        [w[1], w[6]], // 2 vs 7
      ];

      for (const [w1, w2] of qfPairings) {
        upcoming.push({
          weight,
          round: 'qf',
          status: 'upcoming',
          match: {
            winner: { name: w1.name, school: w1.school },
            loser: { name: w2.name, school: w2.school },
            method: null,
          },
          seed1: w1,
          seed2: w2,
        });
      }
    } else {
      // Check if SF matchups can be inferred from QF winners
      const hasSf = live.sf && live.sf.length > 0;
      if (!hasSf && live.qf.length >= 4) {
        const qfWinners = live.qf.map(m => m.winner);
        if (qfWinners.length >= 4) {
          upcoming.push({
            weight,
            round: 'sf',
            status: 'upcoming',
            match: {
              winner: { name: qfWinners[0].name, school: qfWinners[0].school },
              loser: { name: qfWinners[1].name, school: qfWinners[1].school },
              method: null,
            },
            seed1: findWrestlerData(qfWinners[0].name, weight) || qfWinners[0],
            seed2: findWrestlerData(qfWinners[1].name, weight) || qfWinners[1],
          });
          upcoming.push({
            weight,
            round: 'sf',
            status: 'upcoming',
            match: {
              winner: { name: qfWinners[2].name, school: qfWinners[2].school },
              loser: { name: qfWinners[3].name, school: qfWinners[3].school },
              method: null,
            },
            seed1: findWrestlerData(qfWinners[2].name, weight) || qfWinners[2],
            seed2: findWrestlerData(qfWinners[3].name, weight) || qfWinners[3],
          });
        }
      }

      // Check if Finals can be inferred from SF winners
      const hasFinals = live.finals && live.finals.length > 0;
      if (!hasFinals && live.sf && live.sf.length >= 2) {
        const sfWinners = live.sf.map(m => m.winner);
        if (sfWinners.length >= 2) {
          upcoming.push({
            weight,
            round: 'finals',
            status: 'upcoming',
            match: {
              winner: { name: sfWinners[0].name, school: sfWinners[0].school },
              loser: { name: sfWinners[1].name, school: sfWinners[1].school },
              method: null,
            },
            seed1: findWrestlerData(sfWinners[0].name, weight) || sfWinners[0],
            seed2: findWrestlerData(sfWinners[1].name, weight) || sfWinners[1],
          });
        }
      }
    }
  }

  return upcoming;
}

function MatchCard({ entry, isActive }) {
  const { weight, round, match } = entry;
  const wrestler1 = entry.seed1 || findWrestlerData(match.winner?.name, weight) || match.winner || {};
  const wrestler2 = entry.seed2 || findWrestlerData(match.loser?.name, weight) || match.loser || {};

  const w1Name = wrestler1.name || 'TBD';
  const w2Name = wrestler2.name || 'TBD';
  const w1School = wrestler1.school || '';
  const w2School = wrestler2.school || '';
  const w1Seed = wrestler1.seed ? `#${wrestler1.seed}` : '';
  const w2Seed = wrestler2.seed ? `#${wrestler2.seed}` : '';
  const w1Record = wrestler1.record || '';
  const w2Record = wrestler2.record || '';

  return (
    <div className={`${styles.liveMatchCard} ${isActive ? styles.liveMatchActive : styles.liveMatchUpcoming}`}>
      <div className={styles.liveMatchHeader}>
        <span className={styles.liveMatchWeight}>{weight} lbs</span>
        <span className={styles.liveMatchRound}>{ROUND_LABELS[round] || round}</span>
        {isActive && (
          <span className={styles.liveMatchLive}>
            <span className={styles.liveMatchLiveDot} />
            LIVE
          </span>
        )}
      </div>
      <div className={styles.liveMatchBody}>
        <div className={styles.liveMatchWrestler}>
          <div className={styles.liveMatchName}>{w1Name}</div>
          <div className={styles.liveMatchMeta}>
            {w1Seed && <span className={styles.liveMatchSeed}>{w1Seed}</span>}
            <span className={styles.liveMatchSchool}>{w1School}</span>
            {w1Record && <span className={styles.liveMatchRecord}>{w1Record}</span>}
          </div>
        </div>
        <div className={styles.liveMatchVs}>VS</div>
        <div className={styles.liveMatchWrestler}>
          <div className={styles.liveMatchName}>{w2Name}</div>
          <div className={styles.liveMatchMeta}>
            {w2Seed && <span className={styles.liveMatchSeed}>{w2Seed}</span>}
            <span className={styles.liveMatchSchool}>{w2School}</span>
            {w2Record && <span className={styles.liveMatchRecord}>{w2Record}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function matchInvolvesTeam(entry, teamAbbr) {
  const w1 = entry.seed1 || findWrestlerData(entry.match.winner?.name, entry.weight) || entry.match.winner || {};
  const w2 = entry.seed2 || findWrestlerData(entry.match.loser?.name, entry.weight) || entry.match.loser || {};
  return w1.school === teamAbbr || w2.school === teamAbbr;
}

export default function LiveTab({ liveResults, liveDataLoaded }) {
  const [teamFilter, setTeamFilter] = useState(null);

  const { active } = liveDataLoaded ? buildAllMatches(liveResults) : { active: [] };
  const upcoming = liveDataLoaded
    ? [...buildAllMatches(liveResults).upcoming, ...buildUpcomingFromSeeds(liveResults)]
    : buildUpcomingFromSeeds({});

  // Deduplicate upcoming by weight+round+names
  const seen = new Set();
  const dedupedUpcoming = upcoming.filter(e => {
    const key = `${e.weight}-${e.round}-${e.match.winner?.name}-${e.match.loser?.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filteredActive = teamFilter ? active.filter(e => matchInvolvesTeam(e, teamFilter)) : active;
  const filteredUpcoming = teamFilter ? dedupedUpcoming.filter(e => matchInvolvesTeam(e, teamFilter)) : dedupedUpcoming;

  const hasActive = filteredActive.length > 0;
  const hasUpcoming = filteredUpcoming.length > 0;

  return (
    <>
      <h2 className={styles.sectionTitle}>
        Live <span>Matchups</span>
      </h2>
      <p className={styles.sectionIntro}>
        Active and upcoming matches across all weight classes, updated live.
      </p>

      <div className={styles.teamFilter}>
        <button
          className={`${styles.teamFilterPill} ${!teamFilter ? styles.teamFilterPillActive : ''}`}
          onClick={() => setTeamFilter(null)}
        >
          All Teams
        </button>
        {TEAMS.map(team => (
          <button
            key={team.abbr}
            className={`${styles.teamFilterPill} ${teamFilter === team.abbr ? styles.teamFilterPillActive : ''}`}
            onClick={() => setTeamFilter(teamFilter === team.abbr ? null : team.abbr)}
          >
            {team.abbr}
          </button>
        ))}
      </div>

      {hasActive && (
        <div className={styles.liveSection}>
          <h3 className={styles.liveSectionLabel}>
            <span className={styles.liveDot} />
            Active Now
          </h3>
          <div className={styles.liveMatchGrid}>
            {filteredActive.map((entry, i) => (
              <MatchCard key={`active-${i}`} entry={entry} isActive />
            ))}
          </div>
        </div>
      )}

      {!hasActive && liveDataLoaded && (
        <div className={styles.liveEmpty}>
          {teamFilter
            ? `No active matches for ${teamFilter} right now.`
            : 'No matches actively in progress right now. Check back during tournament sessions.'}
        </div>
      )}

      {hasUpcoming && (
        <div className={styles.liveSection}>
          <h3 className={styles.liveSectionLabel}>
            Upcoming Matches
          </h3>
          <div className={styles.liveMatchGrid}>
            {filteredUpcoming.map((entry, i) => (
              <MatchCard key={`upcoming-${i}`} entry={entry} isActive={false} />
            ))}
          </div>
        </div>
      )}

      {!hasActive && !hasUpcoming && !teamFilter && (
        <div className={styles.liveEmpty}>
          No match data available yet. Results will appear once the tournament begins.
        </div>
      )}

      {teamFilter && !hasUpcoming && !hasActive && !liveDataLoaded && (
        <div className={styles.liveEmpty}>
          No upcoming matches found for {teamFilter}.
        </div>
      )}
    </>
  );
}
