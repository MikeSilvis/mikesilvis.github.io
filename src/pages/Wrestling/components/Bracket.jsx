import React from 'react';
import styles from '../Wrestling.module.css';

function BracketSeed({ wrestler, state, showSeedNum }) {
  let className = styles.bracketSeed;
  if (state === 'winner') className += ` ${styles.bracketWinner}`;
  if (state === 'loser') className += ` ${styles.bracketLoser}`;
  if (state === 'pending') className += ` ${styles.bracketPending}`;

  return (
    <div className={className}>
      {showSeedNum && wrestler.seed && (
        <span className={styles.seedNum}>{wrestler.seed}</span>
      )}
      <span className={styles.seedName}>{wrestler.name}</span>
      {wrestler.school && (
        <span className={styles.seedSchool}>{wrestler.school}</span>
      )}
      {wrestler.score && (
        <span className={styles.seedScore}>{wrestler.score}</span>
      )}
    </div>
  );
}

function BracketMatchup({ children, className }) {
  return (
    <div className={`${styles.bracketMatchup}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

export function buildSeededBracket(wrestlers) {
  const w = wrestlers;
  const qf = [
    [w[0], w[7]],
    [w[3], w[4]],
    [w[2], w[5]],
    [w[1], w[6]],
  ];

  return (
    <div className={styles.bracket}>
      <div className={styles.bracketRound}>
        <div className={styles.bracketRoundLabel}>Quarterfinals (Seeded)</div>
        {qf.map((m, i) => (
          <BracketMatchup key={i}>
            <BracketSeed wrestler={m[0]} showSeedNum />
            <BracketSeed wrestler={m[1]} showSeedNum />
          </BracketMatchup>
        ))}
      </div>
      <div className={styles.bracketRound}>
        <div className={styles.bracketRoundLabel}>Semifinals</div>
        <BracketMatchup className={styles.bracketSf}>
          <BracketSeed wrestler={{ name: 'TBD' }} state="pending" />
          <BracketSeed wrestler={{ name: 'TBD' }} state="pending" />
        </BracketMatchup>
        <BracketMatchup className={styles.bracketSf}>
          <BracketSeed wrestler={{ name: 'TBD' }} state="pending" />
          <BracketSeed wrestler={{ name: 'TBD' }} state="pending" />
        </BracketMatchup>
      </div>
      <div className={styles.bracketRound}>
        <div className={styles.bracketRoundLabel}>Finals</div>
        <BracketMatchup className={styles.bracketFinal}>
          <BracketSeed wrestler={{ name: 'TBD' }} state="pending" />
          <BracketSeed wrestler={{ name: 'TBD' }} state="pending" />
        </BracketMatchup>
      </div>
      <div className={styles.bracketRound}>
        <div className={styles.bracketRoundLabel}>Champion</div>
        <div className={styles.bracketChamp} style={{ opacity: 0.5 }}>
          <div className={styles.bracketChampLabel}>Champion</div>
          <div className={styles.bracketChampName}>TBD</div>
          <div className={styles.bracketChampSchool}>Awaiting results</div>
        </div>
      </div>
    </div>
  );
}

export function buildLiveBracket(wrestlers, live) {
  const w = wrestlers;
  const liveQf = live.qf || [];
  const sfMatches = live.sf || [];
  const finalMatches = live.finals || [];

  // Expected QF matchups by seed: 1v8, 4v5, 3v6, 2v7
  const seededQf = [
    [w[0], w[7]],
    [w[3], w[4]],
    [w[2], w[5]],
    [w[1], w[6]],
  ];

  // Try to match each seeded QF to a live result
  const qfSlots = seededQf.map(([top, bottom]) => {
    const match = liveQf.find(m => {
      const names = [m.winner.name, m.loser.name];
      return names.some(n => top.name.includes(n) || n.includes(top.name.split(' ').pop())) ||
             names.some(n => bottom.name.includes(n) || n.includes(bottom.name.split(' ').pop()));
    });
    if (match) return { type: 'result', match };
    return { type: 'pending', top, bottom };
  });

  // QF column
  const qfContent = qfSlots.map((slot, i) => {
    if (slot.type === 'result') {
      const m = slot.match;
      return (
        <BracketMatchup key={i}>
          <BracketSeed
            wrestler={{ name: m.winner.name, school: m.winner.school }}
            state="winner"
          />
          <BracketSeed
            wrestler={{ name: m.loser.name, school: m.loser.school, score: m.method }}
            state="loser"
          />
        </BracketMatchup>
      );
    }
    return (
      <BracketMatchup key={i}>
        <BracketSeed wrestler={slot.top} showSeedNum state="pending" />
        <BracketSeed wrestler={slot.bottom} showSeedNum state="pending" />
      </BracketMatchup>
    );
  });

  // Determine QF winners for SF projections
  const qfWinners = qfSlots.map(slot => {
    if (slot.type === 'result') return { name: slot.match.winner.name, school: slot.match.winner.school };
    return null;
  });

  // SF column
  let sfContent;
  if (sfMatches.length > 0) {
    sfContent = sfMatches.map((m, i) => (
      <BracketMatchup key={i} className={i === 0 ? styles.bracketSf : undefined}>
        <BracketSeed
          wrestler={{ name: m.winner.name, school: m.winner.school }}
          state="winner"
        />
        <BracketSeed
          wrestler={{ name: m.loser.name, school: m.loser.school, score: m.method }}
          state="loser"
        />
      </BracketMatchup>
    ));
  } else {
    sfContent = (
      <>
        <BracketMatchup className={styles.bracketSf}>
          <BracketSeed wrestler={qfWinners[0] || { name: 'TBD' }} state="pending" />
          <BracketSeed wrestler={qfWinners[1] || { name: 'TBD' }} state="pending" />
        </BracketMatchup>
        <BracketMatchup className={styles.bracketSf}>
          <BracketSeed wrestler={qfWinners[2] || { name: 'TBD' }} state="pending" />
          <BracketSeed wrestler={qfWinners[3] || { name: 'TBD' }} state="pending" />
        </BracketMatchup>
      </>
    );
  }

  // Finals column
  let finalsContent;
  if (finalMatches.length > 0) {
    finalsContent = finalMatches.map((m, i) => (
      <BracketMatchup key={i} className={styles.bracketFinal}>
        <BracketSeed
          wrestler={{ name: m.winner.name, school: m.winner.school }}
          state="winner"
        />
        <BracketSeed
          wrestler={{ name: m.loser.name, school: m.loser.school, score: m.method }}
          state="loser"
        />
      </BracketMatchup>
    ));
  } else if (sfMatches.length >= 2) {
    finalsContent = (
      <BracketMatchup className={styles.bracketFinal}>
        <BracketSeed wrestler={{ name: sfMatches[0].winner.name }} state="pending" />
        <BracketSeed wrestler={{ name: sfMatches[1].winner.name }} state="pending" />
      </BracketMatchup>
    );
  } else {
    finalsContent = (
      <BracketMatchup className={styles.bracketFinal}>
        <BracketSeed wrestler={{ name: 'TBD' }} state="pending" />
        <BracketSeed wrestler={{ name: 'TBD' }} state="pending" />
      </BracketMatchup>
    );
  }

  // Champion
  let champContent;
  if (finalMatches.length > 0) {
    const champ = finalMatches[0].winner;
    champContent = (
      <div className={styles.bracketChamp}>
        <div className={styles.bracketChampLabel}>Champion</div>
        <div className={styles.bracketChampName}>{champ.name}</div>
        <div className={styles.bracketChampSchool}>{champ.school}</div>
      </div>
    );
  } else {
    champContent = (
      <div className={styles.bracketChamp} style={{ opacity: 0.5 }}>
        <div className={styles.bracketChampLabel}>Champion</div>
        <div className={styles.bracketChampName}>TBD</div>
        <div className={styles.bracketChampSchool}>In progress</div>
      </div>
    );
  }

  return (
    <div className={styles.bracket}>
      <div className={styles.bracketRound}>
        <div className={styles.bracketRoundLabel}>Quarterfinals</div>
        {qfContent}
      </div>
      <div className={styles.bracketRound}>
        <div className={styles.bracketRoundLabel}>Semifinals</div>
        {sfContent}
      </div>
      <div className={styles.bracketRound}>
        <div className={styles.bracketRoundLabel}>Finals</div>
        {finalsContent}
      </div>
      <div className={styles.bracketRound}>
        <div className={styles.bracketRoundLabel}>Champion</div>
        {champContent}
      </div>
    </div>
  );
}
