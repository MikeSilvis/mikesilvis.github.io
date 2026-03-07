import Card from '../../../components/Card';
import Badge from '../../../components/Badge';
import styles from '../PinewoodDerby.module.css';

const SPECS = [
  { label: 'Total Weight', value: '5.000 oz', note: 'Use a digital scale. Being even 0.1 oz under gives up ~1 car-length at the finish. Be precise.' },
  { label: 'CoG Position', value: '0.9–1.0"', note: 'Measured forward of the rear axle. The "sweet spot" for most BSA tracks. See Weight section for details.' },
  { label: 'CoG Height', value: 'As low as possible', note: 'Low CoG = more stability. Drill weight pockets in the bottom of the car, not the top.' },
  { label: 'Body Shape', value: 'Wedge / Bullet', note: 'Low frontal area reduces air drag by up to 30% vs a standard block shape.' },
  { label: 'Weight Type', value: 'Tungsten', note: '2× denser than lead. Much smaller volume for same mass — perfect for low/rear placement.' },
  { label: 'Axle Polish', value: 'Mirror Finish', note: 'Eliminate burrs on nail heads. Use progressively finer sandpaper (up to 2000 grit) then polish.' },
  { label: 'Lubrication', value: 'Dry Graphite', note: 'Apply powdered graphite between wheel hub and axle. Spin 5× while applying. Wipe excess.' },
  { label: 'Center Clearance', value: '≥ 3/8 inch', note: 'Required to clear the track\'s center rail guide. Build low but not too low.' },
];

const MATRIX = [
  { factor: 'Weight at max (5.00 oz)', impact: 'Critical', impactVariant: 'accent', gain: '+3–5 car lengths', difficulty: 'Easy' },
  { factor: 'Rear CoG (0.9–1.0")', impact: 'Critical', impactVariant: 'accent', gain: '+3–5 car lengths', difficulty: 'Medium' },
  { factor: 'Axle polish & alignment', impact: 'High', impactVariant: 'accent', gain: '+2–4 car lengths', difficulty: 'Medium' },
  { factor: 'Graphite lubrication', impact: 'High', impactVariant: 'blue', gain: '+1–3 car lengths', difficulty: 'Easy' },
  { factor: 'Aerodynamic shape', impact: 'Medium', impactVariant: 'blue', gain: '+1–2 car lengths', difficulty: 'Medium' },
  { factor: 'Wheel surface prep', impact: 'Medium', impactVariant: 'blue', gain: '+0.5–1.5 car lengths', difficulty: 'Hard' },
];

export default function SpecsTab() {
  return (
    <>
      <div className={styles.sectionTitle}>
        Optimal <span>Specs</span>
      </div>
      <p className={styles.sectionIntro}>
        These are the target numbers for a competition-grade Pinewood Derby car. Every dimension is
        chosen to maximize physics advantage within BSA rules.
      </p>

      <div className={styles.specsGrid}>
        {SPECS.map((spec) => (
          <div key={spec.label} className={styles.specCard}>
            <div className={styles.specLabel}>{spec.label}</div>
            <div className={styles.specValue}>{spec.value}</div>
            <div className={styles.specNote}>{spec.note}</div>
          </div>
        ))}
      </div>

      <Card icon="🏆" title="Speed Priority Matrix">
        <div className={styles.tableWrap}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th>Factor</th>
                <th>Impact</th>
                <th>Est. Gain</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.factor}>
                  <td className={styles.matrixFactor}>{row.factor}</td>
                  <td>
                    <Badge variant={row.impactVariant}>{row.impact}</Badge>
                  </td>
                  <td className={styles.matrixGain}>{row.gain}</td>
                  <td className={styles.matrixDifficulty}>{row.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
