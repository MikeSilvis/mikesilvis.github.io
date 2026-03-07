import { useState, useCallback, useEffect } from 'react';
import Card from '../../../components/Card';
import Checklist from '../../../components/Checklist';
import ProgressBar from '../../../components/ProgressBar';
import styles from '../PinewoodDerby.module.css';

const BUILD_ITEMS = [
  { title: 'Chose aerodynamic body shape (wedge or bullet)', note: 'Cut and sand the body to final shape.' },
  { title: 'Drilled rear weight pocket', note: 'Bottom of car, 0.5–1.0" from rear axle slot. Sized for tungsten cubes.' },
  { title: 'Packed tungsten weights into pocket', note: 'Fit snugly with no movement. Dry-fit first, then epoxy when CoG verified.' },
  { title: 'Verified CoG at 0.9–1.0" from rear axle', note: 'Balance test on pencil/dowel. Measured and confirmed.' },
  { title: 'CoG is low (near bottom of car)', note: 'Weights are in bottom pocket, not glued on top.' },
  { title: 'Epoxied all weights permanently', note: 'Shake test: zero rattles. Let cure for 24+ hours.' },
  { title: 'Sanded and finished body', note: 'Smooth surfaces, rounded edges. Painted and sealed.' },
];

const WHEEL_AXLE_ITEMS = [
  { title: 'All 4 axles polished (mirror finish)', note: '400 → 800 → 1200 → 2000 grit + metal polish.' },
  { title: 'Wheel bore inspected, flashing removed', note: 'Use a craft knife or micro drill bit to remove any plastic fins in hub.' },
  { title: 'Wheels trued (if allowed)', note: 'Each wheel spins without side wobble. Tread is round.' },
  { title: 'Graphite applied to all axles', note: 'Powder on shaft, spun in 5–10 times. Excess wiped off.' },
  { title: 'Axles aligned — car rolls straight', note: 'Roll test on flat table. Straight line tracking confirmed.' },
  { title: 'All 4 wheels contact table surface evenly', note: 'No rocking. Check on glass or flat surface.' },
];

const RACE_DAY_ITEMS = [
  { title: 'Final weigh-in: exactly 5.000 oz', note: 'Bring a digital scale to verify. If under, use small adhesive weight strips to hit max.' },
  { title: 'Fresh graphite applied before each heat', note: 'Bring graphite powder tube. A tiny tap on each axle before each run.' },
  { title: 'No loose parts', note: 'Final shake test — zero rattles or movement. Wheels secure but spinning freely.' },
  { title: 'Verified legal dimensions', note: 'Measure length, width, height, and clearance against official gauges at impound.' },
];

const COMMON_MISTAKES = [
  { title: 'Car weighs less than 5.000 oz', desc: 'The #1 fixable mistake. Every 0.1 oz under max costs you real time. Buy tungsten putty to fine-tune to exactly 5.00 oz.' },
  { title: 'CoG too far forward (center or front)', desc: 'Many builders put weights in the middle out of caution. This wastes the biggest advantage available. Move mass rearward.' },
  { title: 'Skipping axle prep', desc: 'Raw factory nails have burrs that create enormous friction. This is a 2–3 hour job that pays back 2–4 car lengths. Don\'t skip it.' },
  { title: 'Loose weights glued on top of car', desc: 'Raises CoG (bad for stability) and risks a weight detaching during race (DQ). Always drill pockets and epoxy securely.' },
  { title: 'Misaligned axles (toe-in/toe-out)', desc: 'A wheel pointing even 2° off-center causes it to drag sideways the entire race. Roll test every car before race day.' },
];

const TOTAL_ITEMS = BUILD_ITEMS.length + WHEEL_AXLE_ITEMS.length + RACE_DAY_ITEMS.length;

export default function ChecklistTab() {
  const [buildProgress, setBuildProgress] = useState({ done: 0, total: BUILD_ITEMS.length, percent: 0 });
  const [wheelProgress, setWheelProgress] = useState({ done: 0, total: WHEEL_AXLE_ITEMS.length, percent: 0 });
  const [raceDayProgress, setRaceDayProgress] = useState({ done: 0, total: RACE_DAY_ITEMS.length, percent: 0 });

  const totalDone = buildProgress.done + wheelProgress.done + raceDayProgress.done;
  const overallPct = TOTAL_ITEMS ? Math.round((totalDone / TOTAL_ITEMS) * 100) : 0;

  return (
    <>
      <div className={styles.sectionTitle}>
        Build <span>Checklist</span>
      </div>
      <p className={styles.sectionIntro}>
        Your complete race-day readiness checklist. Check off each item as you build. Aim for 100%
        before race day.
      </p>

      <Card style={{ marginBottom: '1.5rem' }}>
        <div className={styles.overallHeader}>
          <h3
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.4rem',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              margin: 0,
            }}
          >
            Overall Readiness
          </h3>
          <div className={styles.overallPct}>{overallPct}%</div>
        </div>
        <ProgressBar value={overallPct} height="10px" />
      </Card>

      <Card icon="🔧" title="Build Phase">
        <Checklist
          storageKey="pwd-build-checklist"
          items={BUILD_ITEMS}
          onProgressChange={setBuildProgress}
        />
      </Card>

      <Card icon="⚙️" title="Wheel & Axle Phase">
        <Checklist
          storageKey="pwd-wheel-axle-checklist"
          items={WHEEL_AXLE_ITEMS}
          onProgressChange={setWheelProgress}
        />
      </Card>

      <Card icon="🏁" title="Race Day Phase">
        <Checklist
          storageKey="pwd-race-day-checklist"
          items={RACE_DAY_ITEMS}
          onProgressChange={setRaceDayProgress}
        />
      </Card>

      <div className={styles.divider} />

      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.4rem',
          letterSpacing: '0.08em',
          color: 'var(--accent)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>{'⚠️'}</span> Most Common Race-Losing
        Mistakes
      </div>

      {COMMON_MISTAKES.map((m) => (
        <div key={m.title} className={styles.mistakeItem}>
          <div className={styles.mistakeIcon}>{'✗'}</div>
          <div>
            <div className={styles.mistakeTitle}>{m.title}</div>
            <div className={styles.mistakeDesc}>{m.desc}</div>
          </div>
        </div>
      ))}
    </>
  );
}
