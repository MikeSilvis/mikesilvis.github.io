import { useState, useCallback } from 'react';
import Card from '../../../components/Card';
import styles from '../PinewoodDerby.module.css';

function computeCogData(val) {
  let advantage, barPct, status, desc;
  if (val <= 0.5) {
    advantage = 1.5;
    barPct = 30;
    status = '⚠️ Too Far Rear';
    desc = 'Risk of front wheels lifting on the ramp. Unstable, may veer off course.';
  } else if (val <= 0.7) {
    advantage = 3.5;
    barPct = 70;
    status = '👍 Good';
    desc = 'Getting close to optimal. Most mass is benefiting from the ramp height difference.';
  } else if (val <= 1.2) {
    const peak = 1.0;
    const span = 0.25;
    const dist = Math.abs(val - peak);
    advantage = parseFloat((5.0 - (dist / span) * 0.8).toFixed(1));
    advantage = Math.min(advantage, 5.0);
    barPct = 85 + (1 - dist / span) * 15;
    status = '✅ Optimal Zone';
    desc =
      'Car lengths ahead vs a front-weighted car. This is the sweet spot — rear enough to gain potential energy, front enough to maintain stability.';
  } else if (val <= 2.0) {
    advantage = parseFloat((4.0 - (val - 1.2) * 2.5).toFixed(1));
    barPct = 65;
    status = '😐 Acceptable';
    desc = "CoG moving toward center. You're leaving speed on the table — try moving mass further back.";
  } else if (val <= 2.8) {
    advantage = parseFloat((2.0 - (val - 2.0) * 1.5).toFixed(1));
    barPct = 35;
    status = '📉 Below Average';
    desc = 'Center-weighted car. Likely what most beginners build — faster than front, but not competitive.';
  } else {
    advantage = 0;
    barPct = 10;
    status = '❌ Front-Weighted';
    desc = 'Maximum disadvantage. Mass falls the least height. Slowest possible CoG position.';
  }
  return { advantage: Math.max(0, advantage), barPct, status, desc };
}

function computeCogX(val) {
  const trackPx = 480 - 120; // 360px for 4.25"
  const pxPerInch = trackPx / 4.25;
  const cogX = 480 - val * pxPerInch;
  return Math.max(60, Math.min(540, cogX));
}

const MATERIALS = [
  { label: 'Tungsten', value: 'Best', valueClass: 'specValueGreen', note: '19.3 g/cm³ density. Tiny cubes hold lots of mass. Safe, non-toxic. Allows precise placement. Recommended for serious builds.' },
  { label: 'Lead', value: 'Good', valueClass: null, note: '11.3 g/cm³. Malleable, cheap. Larger volume than tungsten. Handle with gloves. Some packs may restrict use.' },
  { label: 'Steel / Zinc', value: 'Okay', valueClass: 'specValueYellow', note: '7.8–7.1 g/cm³. Larger volume needed. Harder to place precisely. Use as last resort or supplemental mass.' },
  { label: 'Coins / Random', value: 'Avoid', valueClass: 'specValueRed', note: 'Inconsistent, hard to secure, bulky. Often causes top-heavy CoG. Not race-day reliable.' },
];

const COG_STEPS = [
  <><strong>Add all weights to the car</strong> — insert tungsten cubes into a pre-drilled pocket near the rear.</>,
  <><strong>Balance the car on a round pencil or dowel</strong> placed perpendicular to the car&apos;s length on a flat table.</>,
  <><strong>Slide the pencil until the car balances level.</strong> Mark this point — it&apos;s your CoG.</>,
  <><strong>Measure from that mark to the rear axle.</strong> Target: 0.9–1.0 inches forward of the rear axle.</>,
  <><strong>Too rear-heavy?</strong> Move weights slightly forward. Too front-heavy? Drill a pocket closer to the rear and repack.</>,
  <><strong>Verify again after any painting or finishing</strong> — paint weight can shift balance.</>,
];

export default function WeightTab() {
  const [cogVal, setCogVal] = useState(1.0);
  const data = computeCogData(cogVal);
  const cogX = computeCogX(cogVal);

  const handleSlider = useCallback((e) => {
    setCogVal(parseFloat(e.target.value));
  }, []);

  return (
    <>
      <div className={styles.sectionTitle}>
        Weight <span>&amp;</span> Center of Gravity
      </div>
      <p className={styles.sectionIntro}>
        This is the single most impactful factor in Pinewood Derby speed. Get this right and
        you&apos;re already ahead of most of the field.
      </p>

      <Card icon="🔭" title="The Physics: Why Rear CoG Wins">
        <p className={styles.cardBodySpaced}>
          The track has an initial steep drop, then a long flat section. If your{' '}
          <span
            className={styles.tooltip}
            data-tooltip="The single point where the car's mass is balanced. Also called balance point or center of mass."
          >
            Center of Gravity (CoG)
          </span>{' '}
          is positioned toward the rear, it sits higher on the ramp&apos;s slope for longer — meaning
          your car&apos;s mass has fallen a greater height by the time it reaches the flat. More height
          = more potential energy converted to kinetic energy = higher speed.
        </p>
        <p className={styles.cardBodyNoMargin}>
          Concretely: a rear-weighted car (CoG ~1&quot; ahead of rear axle) can be{' '}
          <strong className={styles.textOrange}>4–5 car lengths faster</strong> than an identical car
          with the CoG in the center — even at the same total weight.
        </p>
      </Card>

      {/* CoG Slider Simulator */}
      <div className={styles.sliderSection}>
        <Card icon="🎚️" title="CoG Position Simulator" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <div className={styles.sliderLabel}>
            <span className={styles.sliderLabelTitle}>CoG Distance from Rear Axle</span>
            <span className={styles.sliderLabelValue}>{cogVal.toFixed(1)} inches</span>
          </div>
          <input
            type="range"
            className={styles.rangeInput}
            min="0.5"
            max="3.5"
            step="0.1"
            value={cogVal}
            onChange={handleSlider}
          />
          <div className={styles.sliderTicks}>
            <span>0.5&quot; (rear)</span>
            <span>1.0&quot; (optimal)</span>
            <span>3.5&quot; (front)</span>
          </div>

          <div>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text3)',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Speed Advantage vs Front-Weighted Car
            </div>
            <div className={styles.resultBarWrap}>
              <div className={styles.resultBar} style={{ width: `${data.barPct}%` }} />
            </div>
          </div>

          <div className={styles.advantageDisplay}>
            <div className={styles.advantageNum}>{data.advantage.toFixed(1)}</div>
            <div className={styles.advantageDesc}>
              <div className={styles.advantageStatus}>{data.status}</div>
              <div>{data.desc}</div>
            </div>
          </div>

          {/* Car SVG visualization */}
          <div className={styles.carVizWrap}>
            <div className={styles.carVizLabel}>Car Balance Visualization</div>
            <svg viewBox="0 0 600 80" style={{ width: '100%', height: 'auto' }}>
              {/* car body */}
              <rect x="50" y="20" width="500" height="35" rx="4" fill="#1e2232" stroke="#2a2f45" strokeWidth="1.5" />
              {/* wheels */}
              <circle cx="120" cy="55" r="12" fill="#111" stroke="#444" strokeWidth="2" />
              <circle cx="480" cy="55" r="12" fill="#111" stroke="#444" strokeWidth="2" />
              {/* axle marks */}
              <line x1="120" y1="20" x2="120" y2="55" stroke="#2a2f45" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="480" y1="20" x2="480" y2="55" stroke="#2a2f45" strokeWidth="1" strokeDasharray="3,3" />
              {/* labels */}
              <text x="120" y="76" textAnchor="middle" fill="#5a6278" fontSize="9" fontFamily="DM Mono,monospace">REAR</text>
              <text x="480" y="76" textAnchor="middle" fill="#5a6278" fontSize="9" fontFamily="DM Mono,monospace">FRONT</text>
              {/* CoG marker */}
              <line x1={cogX} y1="10" x2={cogX} y2="55" stroke="#f97316" strokeWidth="2" />
              <circle cx={cogX} cy="37" r="5" fill="#f97316" />
              <text x={cogX} y="8" textAnchor="middle" fill="#f97316" fontSize="9" fontFamily="DM Mono,monospace">CoG</text>
            </svg>
          </div>
        </Card>
      </div>

      <Card icon="🪨" title="Weight Material Comparison">
        <div className={styles.specsGrid} style={{ marginBottom: 0 }}>
          {MATERIALS.map((m) => (
            <div key={m.label} className={styles.specCard}>
              <div className={styles.specLabel}>{m.label}</div>
              <div className={m.valueClass ? styles[m.valueClass] : styles.specValue}>{m.value}</div>
              <div className={styles.specNote}>{m.note}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card icon="📏" title="How to Measure Your CoG">
        <ol className={styles.numberSteps}>
          {COG_STEPS.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Card>
    </>
  );
}
