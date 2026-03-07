import { useState, useCallback } from 'react';
import Card from '../../../components/Card';
import Checklist from '../../../components/Checklist';
import ProgressBar from '../../../components/ProgressBar';
import styles from '../PinewoodDerby.module.css';

const AXLE_ITEMS = [
  { title: 'Inspect for burrs', note: 'Examine nail head rim under good light. Look for sharp raised edges or casting marks.' },
  { title: 'File the crimp marks', note: 'Use a fine needle file to smooth the crimp mark on the nail head edge (where the wheel contacts).' },
  { title: 'Sand with 400 → 800 → 1200 → 2000 grit', note: 'Mount axle in a drill on low speed. Hold sandpaper against the shaft. Work through grits progressively.' },
  { title: 'Polish to mirror finish', note: 'Use metal polish (Mothers Mag, Brasso) with a cloth on spinning axle. Polish until reflective.' },
  { title: 'Apply graphite lube', note: 'Coat the axle shaft with dry powdered graphite. Spin the wheel 5–10 times to distribute. Wipe excess.' },
  { title: 'Check axle alignment', note: 'Install and sight down the track — wheels should be parallel and not toe in/out. Use a flat surface to verify.' },
];

const WHEEL_ITEMS = [
  { title: 'Inspect wheel bore', note: 'Check for flashing (plastic fins) inside the hub bore — these create contact friction. Remove carefully.' },
  { title: 'True the wheel (if allowed)', note: 'Mount on axle in a drill, hold against fine sandpaper at low speed to make tread perfectly round. Check local rules.' },
  { title: 'Check for wobble', note: 'Spin wheel on axle. Watch for any side-to-side wobble. Reject warped wheels from the kit — swap for a better one.' },
  { title: 'Minimize wheel contact area', note: 'The wheel hub should only barely contact the car body. Leave a 1–2mm gap. Too tight = friction. Too loose = wobble.' },
];

const WHEEL_MISTAKES = [
  { title: 'Using WD-40 or oil lubricants', desc: 'These attract dust and actually increase friction over the course of a race. Only dry graphite powder is BSA-legal and effective.' },
  { title: 'Pressing axles in too tight', desc: 'An axle pressed in with too much force bends slightly, causing wheels to toe in or out and drag against the car body.' },
  { title: 'Ignoring one "boring" wheel', desc: 'All four wheels matter. One rough axle can negate three perfect ones. Treat all four identically.' },
];

export default function WheelsTab() {
  const [axleProgress, setAxleProgress] = useState({ done: 0, total: 6, percent: 0 });
  const [wheelProgress, setWheelProgress] = useState({ done: 0, total: 4, percent: 0 });

  const handleAxleProgress = useCallback((p) => setAxleProgress(p), []);
  const handleWheelProgress = useCallback((p) => setWheelProgress(p), []);

  return (
    <>
      <div className={styles.sectionTitle}>
        Wheels <span>&amp;</span> Axles
      </div>
      <p className={styles.sectionIntro}>
        After weight and CoG, wheel and axle preparation is the highest-ROI improvement. Even small
        friction increases in four axles compound significantly over 32 feet of track.
      </p>

      <Card icon="⚙️" title="Why Axle Prep Matters">
        <p className={styles.cardBodyNoMargin}>
          BSA nail axles have factory burrs, ridges, and rough surfaces. Each wheel contacts its axle
          at a tiny point — but friction at that point persists for 4+ seconds of race time. A
          polished axle can reduce rolling friction by 30–50% compared to a raw nail. Across four
          wheels, this is substantial.
        </p>
      </Card>

      <div className={styles.twoCol}>
        <div>
          <div className={styles.sectionSubTitle}>Axle Prep Steps</div>
          <Checklist storageKey="pwd-axle-checklist" items={AXLE_ITEMS} onProgressChange={handleAxleProgress} />
          <div style={{ marginTop: '0.8rem' }}>
            <div className={styles.progressLabel}>Axle Progress</div>
            <ProgressBar value={axleProgress.percent} />
            <div className={styles.progressText}>
              {axleProgress.done} / {axleProgress.total} steps complete
            </div>
          </div>
        </div>

        <div>
          <div className={styles.sectionSubTitle}>Wheel Prep</div>
          <Checklist storageKey="pwd-wheel-checklist" items={WHEEL_ITEMS} onProgressChange={handleWheelProgress} />
          <div style={{ marginTop: '0.8rem' }}>
            <div className={styles.progressLabel}>Wheel Progress</div>
            <ProgressBar value={wheelProgress.percent} />
            <div className={styles.progressText}>
              {wheelProgress.done} / {wheelProgress.total} steps complete
            </div>
          </div>
        </div>
      </div>

      <Card icon="🚫" title="Common Wheel Mistakes" style={{ marginTop: '1.5rem' }}>
        {WHEEL_MISTAKES.map((m) => (
          <div key={m.title} className={styles.mistakeItem}>
            <div className={styles.mistakeIcon}>{'✗'}</div>
            <div>
              <div className={styles.mistakeTitle}>{m.title}</div>
              <div className={styles.mistakeDesc}>{m.desc}</div>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
