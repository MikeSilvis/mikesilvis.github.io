import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Wrestling.css';

const WEIGHTS = [125, 133, 141, 149, 157, 165, 174, 184, 197, 285];
const TOURNAMENT_ID = 'big-ten-2026';

const ROUND_LABELS = {
  qf: 'Quarterfinals',
  sf: 'Semifinals',
  finals: 'Finals',
};

function MatchCard({ match }) {
  return (
    <div className="match-card">
      <div className="match-wrestler winner">
        <span className="seed">({match.winner.seed || '?'})</span>
        <span className="name">{match.winner.name}</span>
        <span className="school">{match.winner.school}</span>
        <span className="win-marker">W</span>
      </div>
      <div className="match-wrestler loser">
        <span className="seed">({match.loser.seed || '?'})</span>
        <span className="name">{match.loser.name}</span>
        <span className="school">{match.loser.school}</span>
      </div>
      <div className="match-method">{match.method}</div>
    </div>
  );
}

function Placements({ placement }) {
  const entries = Object.entries(placement);
  if (entries.length === 0) return null;

  return (
    <div className="placements">
      <h4 className="round-title">Final Placements</h4>
      <div className="placement-list">
        {entries.map(([place, wrestler]) => (
          <div key={place} className={`placement-item place-${place.replace(/\W/g, '')}`}>
            <span className="place-label">{place}</span>
            <span className="name">{wrestler.name}</span>
            <span className="school">{wrestler.school}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeightClass({ data }) {
  if (!data) return <div className="empty-state">No data available</div>;

  const totalMatches = (data.qf?.length || 0) + (data.sf?.length || 0) + (data.finals?.length || 0);
  const hasPlacement = data.placement && Object.keys(data.placement).length > 0;

  if (totalMatches === 0 && !hasPlacement) {
    return <div className="empty-state">No matches reported yet. Check back soon.</div>;
  }

  return (
    <div className="weight-content">
      {hasPlacement && <Placements placement={data.placement} />}
      {['finals', 'sf', 'qf'].map(round => {
        const matches = data[round];
        if (!matches || matches.length === 0) return null;
        return (
          <div key={round} className="round-section">
            <h4 className="round-title">{ROUND_LABELS[round]}</h4>
            <div className="matches-grid">
              {matches.map((m, i) => <MatchCard key={i} match={m} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Wrestling() {
  const [weights, setWeights] = useState(null);
  const [activeWeight, setActiveWeight] = useState(125);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stale, setStale] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch(`/api/results/${TOURNAMENT_ID}`);
      if (!res.ok) throw new Error('Failed to fetch results');
      const json = await res.json();
      setWeights(json.weights);
      setStale(json.stale || false);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  const totalMatches = weights
    ? Object.values(weights).reduce((sum, wt) =>
        sum + (wt.qf?.length || 0) + (wt.sf?.length || 0) + (wt.finals?.length || 0), 0)
    : 0;

  return (
    <div className="wrestling-page">
      <header className="wrestling-header">
        <Link to="/" className="back-link">Back</Link>
        <div className="header-content">
          <h1 className="tournament-title">Big Ten Wrestling Championships</h1>
          <p className="tournament-subtitle">2026 - Bryce Jordan Center</p>
          <div className="live-indicator">
            <span className="live-dot" />
            <span>Live Results</span>
            {lastUpdated && (
              <span className="last-updated">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </header>

      {stale && (
        <div className="stale-banner">
          Showing cached results. Live data temporarily unavailable.
        </div>
      )}

      <nav className="weight-tabs">
        {WEIGHTS.map(wt => {
          const wtData = weights?.[wt];
          const hasData = wtData && (
            (wtData.qf?.length || 0) + (wtData.sf?.length || 0) + (wtData.finals?.length || 0) > 0
            || (wtData.placement && Object.keys(wtData.placement).length > 0)
          );
          return (
            <button
              key={wt}
              className={`weight-tab ${activeWeight === wt ? 'active' : ''} ${hasData ? 'has-data' : ''}`}
              onClick={() => setActiveWeight(wt)}
            >
              {wt}
            </button>
          );
        })}
      </nav>

      <main className="wrestling-main">
        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <p>Fetching live results...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchResults} className="retry-btn">Retry</button>
          </div>
        ) : (
          <>
            <h2 className="active-weight-title">{activeWeight} lbs</h2>
            <WeightClass data={weights?.[activeWeight]} />
          </>
        )}
      </main>

      <footer className="wrestling-footer">
        <p>{totalMatches} matches reported across all weight classes</p>
        <button onClick={fetchResults} className="refresh-btn" disabled={loading}>
          Refresh Results
        </button>
      </footer>
    </div>
  );
}
