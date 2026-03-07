import { useState, useEffect, useCallback, useRef } from 'react';
import { TEAMS } from '../data/teams';
import { WEIGHT_CLASSES } from '../data/weightClasses';

const TOURNAMENT_ID = '964607132';
const REFRESH_INTERVAL = 180000; // 3 minutes
const CACHE_KEY = `wrestling-${TOURNAMENT_ID}`;

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

export default function useLiveResults() {
  const [liveResults, setLiveResults] = useState({});
  const [liveDataLoaded, setLiveDataLoaded] = useState(false);
  const [statusText, setStatusText] = useState('Loading live results...');
  const [statusTime, setStatusTime] = useState('');
  const [isStale, setIsStale] = useState(false);
  const intervalRef = useRef(null);

  const fetchLiveResults = useCallback(async () => {
    setStatusText('Fetching live results...');

    try {
      const resp = await fetch('/api/results/' + TOURNAMENT_ID);
      if (!resp.ok) throw new Error('API returned ' + resp.status);
      const data = await resp.json();

      // Cache for offline fallback
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: data.weights, timestamp: Date.now(),
        }));
      } catch (e) { /* storage full */ }

      const newResults = {};
      for (const [wt, results] of Object.entries(data.weights)) {
        newResults[wt] = results;
      }

      const matchCount = Object.values(newResults).reduce((sum, wt) => {
        return sum + (wt.qf || []).length + (wt.sf || []).length + (wt.finals || []).length;
      }, 0);

      if (matchCount > 0) {
        setLiveResults(newResults);
        setLiveDataLoaded(true);
        setIsStale(!!data.stale);
        setStatusText(`Live results loaded -- ${matchCount} matches${data.stale ? ' (cached)' : ''}`);
        setStatusTime('Updated ' + new Date().toLocaleTimeString());
      } else {
        setStatusText('Using seeded brackets (no results available yet)');
        setStatusTime('Brackets not yet posted');
      }
    } catch (err) {
      console.warn('API fetch failed, trying localStorage cache:', err);

      // Fallback: localStorage cache
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const newResults = {};
          for (const [wt, results] of Object.entries(data)) {
            newResults[wt] = results;
          }
          const ago = Math.round((Date.now() - timestamp) / 60000);
          setLiveResults(newResults);
          setLiveDataLoaded(true);
          setIsStale(true);
          setStatusText(`Cached results -- from ${ago} min ago`);
          setStatusTime('Offline mode');
          return;
        }
      } catch (e) { /* ignore parse errors */ }

      setStatusText('Using seeded brackets (live results unavailable)');
      setStatusTime(err.message);
    }
  }, []);

  useEffect(() => {
    fetchLiveResults();
    intervalRef.current = setInterval(fetchLiveResults, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchLiveResults]);

  return {
    liveResults,
    liveDataLoaded,
    statusText,
    statusTime,
    isStale,
    refresh: fetchLiveResults,
  };
}
