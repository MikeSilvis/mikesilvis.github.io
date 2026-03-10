import { TEAMS } from '../data/teams';
import { WEIGHT_CLASSES } from '../data/weightClasses';
import { PERSISTED_RESULTS } from '../data/results';

const PLACEMENT_POINTS = {
  '1ST': 16, '2ND': 12, '3RD': 10, '4TH': 9,
  '5TH': 7, '6TH': 6, '7TH': 4, '8TH': 3,
};

const BONUS_POINTS = { fall: 2, tf: 1.5, md: 1, sv: 0, tb: 0, dec: 0 };

const SCHOOL_ABBR_MAP = {};
TEAMS.forEach(t => { SCHOOL_ABBR_MAP[t.abbr] = t.name; });

function classifyMethod(method) {
  if (!method) return null;
  const m = method.toLowerCase();
  if (m.startsWith('fall')) return 'fall';
  if (m.startsWith('tf') || m.startsWith('rtf')) return 'tf';
  if (m.startsWith('md')) return 'md';
  return 'dec';
}

export function computeLiveStandings(liveResults) {
  const teamScores = {};
  TEAMS.forEach(t => { teamScores[t.name] = 0; });

  const weights = [125, 133, 141, 149, 157, 165, 174, 184, 197, 285];
  for (const wt of weights) {
    const live = liveResults[wt];
    if (!live) continue;

    // Placement points
    if (live.placement) {
      for (const [place, info] of Object.entries(live.placement)) {
        const pts = PLACEMENT_POINTS[place] || 0;
        const teamName = SCHOOL_ABBR_MAP[info.school] || info.school;
        if (teamScores[teamName] !== undefined) {
          teamScores[teamName] += pts;
        }
      }
    }

    // Advancement points (1 pt per win) + bonus points from match results
    const allMatches = [...(live.qf || []), ...(live.sf || []), ...(live.finals || [])];
    for (const match of allMatches) {
      if (match.winner && match.winner.name !== 'TBD') {
        const teamName = SCHOOL_ABBR_MAP[match.winner.school] || match.winner.school;
        if (teamScores[teamName] !== undefined) {
          teamScores[teamName] += 1; // advancement point
          const type = classifyMethod(match.method);
          if (type && BONUS_POINTS[type]) {
            teamScores[teamName] += BONUS_POINTS[type];
          }
        }
      }
    }
  }

  return Object.entries(teamScores)
    .map(([team, score]) => ({ team, score }))
    .sort((a, b) => b.score - a.score)
    .filter(s => s.score > 0 || TEAMS.some(t => t.name === s.team));
}

export function findLiveRecord(name, live) {
  for (const round of ['qf', 'sf', 'finals', 'r16']) {
    if (!live[round]) continue;
    for (const m of live[round]) {
      if (m.winner.name === name && m.winner.record) return m.winner.record;
      if (m.loser.name === name && m.loser.record) return m.loser.record;
    }
  }
  return null;
}

export function getWrestlerResults(name, live) {
  const results = [];
  for (const round of ['r16', 'qf', 'sf', 'finals']) {
    if (!live[round]) continue;
    for (const m of live[round]) {
      if (m.winner.name === name) results.push({ won: true, method: m.method, opponent: m.loser.name });
      if (m.loser.name === name) results.push({ won: false, method: m.method, opponent: m.winner.name });
    }
  }
  return results;
}

export function getTeamRoster(teamName) {
  const roster = [];
  for (const [weight, data] of Object.entries(WEIGHT_CLASSES)) {
    for (const w of data.wrestlers) {
      if (w.school === teamName) {
        roster.push({
          name: w.name,
          weight: weight + ' lbs',
          seed: w.seed,
          record: w.record,
          img: w.img || '',
          ig: w.ig || '',
          igUrl: w.ig ? 'https://instagram.com/' + w.ig.replace('@', '') : '',
        });
      }
    }
  }
  return roster;
}

// Precomputed since results are static
const MATCH_COUNT = Object.values(PERSISTED_RESULTS).reduce((sum, wt) => {
  return sum + (wt.qf || []).length + (wt.sf || []).length + (wt.finals || []).length;
}, 0);

const LIVE_RESULTS = {
  liveResults: PERSISTED_RESULTS,
  liveDataLoaded: true,
  statusText: `Final results &mdash; ${MATCH_COUNT} matches`,
  statusTime: 'Tournament complete',
};

export default function useLiveResults() {
  return LIVE_RESULTS;
}
