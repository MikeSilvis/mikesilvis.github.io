import { useEffect, useRef } from 'react';
import Card from '../../../components/Card';
import styles from '../PinewoodDerby.module.css';

function drawTrack(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Background
  ctx.fillStyle = '#13161e';
  ctx.fillRect(0, 0, w, h);

  // Draw ramp
  ctx.strokeStyle = '#2a2f45';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(280, 80);
  ctx.stroke();

  // Flat section
  ctx.beginPath();
  ctx.moveTo(280, 80);
  ctx.lineTo(w, 80);
  ctx.stroke();
  ctx.setLineDash([]);

  // Height drop indicator
  ctx.strokeStyle = 'rgba(249,115,22,0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 35);
  ctx.lineTo(60, 80);
  ctx.stroke();
  ctx.fillStyle = 'rgba(249,115,22,0.7)';
  ctx.font = '10px DM Mono, monospace';
  ctx.fillText('₁', 63, 60); // subscript
  ctx.fillText('h', 63, 60);

  ctx.beginPath();
  ctx.moveTo(200, 60);
  ctx.lineTo(200, 80);
  ctx.stroke();
  ctx.fillText('h', 203, 72);

  // Gravity arrow
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(380, 30);
  ctx.lineTo(380, 65);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(376, 62);
  ctx.lineTo(380, 70);
  ctx.lineTo(384, 62);
  ctx.fillStyle = '#3b82f6';
  ctx.fill();
  ctx.fillStyle = '#3b82f6';
  ctx.font = '9px DM Mono, monospace';
  ctx.fillText('g', 383, 50);

  // Labels
  ctx.fillStyle = '#5a6278';
  ctx.font = '9px DM Mono, monospace';
  ctx.fillText('START', 10, 15);
  ctx.fillText('FLAT SECTION', 310, 75);

  // Front car (CoG forward)
  ctx.fillStyle = 'rgba(239,68,68,0.4)';
  ctx.fillRect(90, 28, 35, 10);
  ctx.fillStyle = 'rgba(239,68,68,0.8)';
  ctx.font = '8px sans-serif';
  ctx.fillText('•', 99, 38);

  // Rear car (CoG rear)
  ctx.fillStyle = 'rgba(34,197,94,0.4)';
  ctx.fillRect(30, 40, 35, 10);
  ctx.fillStyle = 'rgba(34,197,94,0.8)';
  ctx.fillText('•', 35, 50);

  ctx.fillStyle = '#5a6278';
  ctx.font = '8px DM Mono, monospace';
  ctx.fillText('Rear CoG (more height = faster)', 10, 105);

  // Finish flag
  ctx.fillStyle = '#f97316';
  ctx.fillRect(w - 25, 68, 20, 2);
  ctx.font = '14px sans-serif';
  ctx.fillText('🏁', w - 28, 68);
}

export default function IntroTab() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawTrack(canvasRef.current);
    }
  }, []);

  return (
    <>
      <div className={styles.sectionTitle}>
        What is <span>Pinewood</span> Derby?
      </div>
      <p className={styles.sectionIntro}>
        A gravity-powered wooden car race run by BSA Cub Scout packs. Cars are built from an official
        BSA kit — a block of pine, four plastic wheels, and four nails for axles — then raced down
        an inclined track. The car crosses the finish line fastest wins.
      </p>

      <Card icon="🎯" title="The Goal">
        <p className={styles.cardBody}>
          Build the <strong style={{ color: 'var(--text)' }}>fastest legal car</strong> within BSA
          rules. That means extracting every legal performance advantage from weight distribution,
          aerodynamics, wheel prep, and car stability — while keeping total mass at exactly 5.000 oz.
        </p>
      </Card>

      <div className={styles.twoCol}>
        <Card icon="📏" title="Standard BSA Rules">
          <ul className={styles.ruleList}>
            <li>
              ⚡ Max weight: <strong>5.000 oz</strong>
            </li>
            <li>
              ⚡ Max length: <strong>7 inches</strong>
            </li>
            <li>
              ⚡ Max width: <strong>2¾ inches</strong>
            </li>
            <li>
              ⚡ Min wheelbase: <strong>4¼ inches</strong>
            </li>
            <li>
              ⚡ Min clearance: <strong>3/8&quot; (center rail)</strong>
            </li>
            <li>
              ⚡ Wheels: <strong>BSA-approved only</strong>
            </li>
          </ul>
        </Card>
        <Card icon="🔑" title="Four Keys to Speed">
          <ul className={styles.keysList}>
            <li>
              <span className={styles.keysNum}>①</span>{' '}
              <strong>Weight at max</strong> — always hit 5.00 oz
            </li>
            <li>
              <span className={styles.keysNum}>②</span>{' '}
              <strong>CoG rearward</strong> — maximize drop height
            </li>
            <li>
              <span className={styles.keysNum}>③</span>{' '}
              <strong>Low aero drag</strong> — wedge/bullet shape
            </li>
            <li>
              <span className={styles.keysNum}>④</span>{' '}
              <strong>Frictionless wheels</strong> — polish & align
            </li>
          </ul>
        </Card>
      </div>

      <Card icon="📉" title="The Physics in 60 Seconds">
        <p className={styles.cardBodySpaced}>
          At the top of the ramp, your car has{' '}
          <span className={styles.tooltip} data-tooltip="PE = mass x gravity x height. Every gram at max weight counts.">
            potential energy
          </span>
          . That converts to kinetic energy (speed) as it rolls down. Three forces slow your car:{' '}
          <strong className={styles.textRed}>rolling friction</strong> (wheel bearings),{' '}
          <strong className={styles.textRed}>air drag</strong> (shape), and{' '}
          <strong className={styles.textRed}>wheel wobble</strong> (misalignment). Your job: minimize
          all three while maximizing starting potential energy with correct CoG positioning.
        </p>
        <canvas
          ref={canvasRef}
          width={700}
          height={120}
          style={{ width: '100%', maxWidth: 700, borderRadius: 6 }}
        />
      </Card>
    </>
  );
}
