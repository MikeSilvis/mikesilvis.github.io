import Card from '../../../components/Card';
import styles from '../PinewoodDerby.module.css';

const TRACK_TYPES = [
  {
    type: 'Fast aluminum track (smooth)',
    cog: '0.9–1.0" from rear axle',
    cogColor: 'var(--accent)',
    why: 'Smooth track can handle maximum rear bias. Most competitive packs.',
  },
  {
    type: 'Older wood track (rough)',
    cog: '1.0–1.3" from rear axle',
    cogColor: 'var(--yellow)',
    why: 'Bumpy surface needs more front weight to prevent bouncing and rail contact.',
  },
  {
    type: 'Unknown track',
    cog: '1.0" from rear axle',
    cogColor: 'var(--blue2)',
    why: 'Safe middle ground. Adjust 0.1–0.2" if you can test-run before race day.',
  },
];

const STABILITY_TIPS = [
  {
    title: 'Roll the car on a flat surface',
    desc: 'Before race day, push the car gently on a flat table. It should roll in a perfectly straight line. Any curving means a misaligned axle.',
  },
  {
    title: 'Verify all 4 wheels touch',
    desc: 'Set the car on glass or a mirror. All four wheel edges should contact evenly. If one wheel rocks, re-seat that axle.',
  },
  {
    title: 'Secure all weights firmly',
    desc: 'Loose weights shift during the race, changing CoG mid-run. Epoxy every weight block in place. Verify by shaking the car — zero rattles allowed.',
  },
  {
    title: 'Re-graphite at race day',
    desc: 'Bring a tube of graphite powder to the race. Apply fresh lube just before each heat. A little graphite goes a long way.',
  },
];

export default function StabilityTab() {
  return (
    <>
      <div className={styles.sectionTitle}>
        Stability <span>&amp;</span> Track Setup
      </div>
      <p className={styles.sectionIntro}>
        A fast car that wobbles, bounces off rails, or veers sideways loses all that speed. Stability
        is the foundation that lets your weight and wheel prep actually work.
      </p>

      <div className={styles.twoCol}>
        <Card icon="⚖️" title="Wheel Load Distribution">
          <p className={styles.smallTextSpaced}>
            With a rear CoG, the rear wheels carry ~3.5–4 oz and the front wheels carry only
            ~1–1.5 oz. This is intentional and fine — but the front wheels must still have{' '}
            <em>some</em> load to track straight.
          </p>
          <p className={styles.smallText}>
            If your CoG is too far back, front wheels become unloaded, causing the car to
            &quot;steer&quot; erratically down the lane or bounce off the center rail repeatedly.
          </p>
        </Card>
        <Card icon="🎯" title="The Rail-Riding Trick">
          <p className={styles.smallTextSpaced}>
            Many competitive builders angle one front wheel slightly outward so it rides the center
            rail, effectively eliminating side-to-side drift entirely. This is called
            &quot;rail-riding.&quot;
          </p>
          <p className={styles.smallText}>
            Check if this is legal at your pack. When legal, it straightens the car perfectly and
            lets you optimize the other 3 wheels for minimum friction.
          </p>
        </Card>
      </div>

      <Card icon="📊" title="Track Type Adjustments">
        <div className={styles.tableWrap}>
          <table className={styles.stabilityTable}>
            <thead>
              <tr>
                <th>Track Type</th>
                <th>Recommended CoG</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {TRACK_TYPES.map((row, i) => (
                <tr key={i}>
                  <td className={styles.stabilityFactor}>{row.type}</td>
                  <td className={styles.stabilityMono} style={{ color: row.cogColor }}>
                    {row.cog}
                  </td>
                  <td style={{ color: 'var(--text2)' }}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card icon="🔎" title="Stability Checklist">
        {STABILITY_TIPS.map((tip) => (
          <div key={tip.title} className={styles.tipItem}>
            <div className={styles.tipIcon}>{'✓'}</div>
            <div>
              <div className={styles.mistakeTitle}>{tip.title}</div>
              <div className={styles.mistakeDesc}>{tip.desc}</div>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
