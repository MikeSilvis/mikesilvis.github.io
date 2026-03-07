import { useState, useRef, useCallback, useEffect } from 'react';
import Card from '../../../components/Card';
import Accordion from '../../../components/Accordion';
import Checklist from '../../../components/Checklist';
import ProgressBar from '../../../components/ProgressBar';
import styles from '../PinewoodDerby.module.css';

/* ── Shape definitions ── */
const SHAPES = [
  {
    id: 'bullet',
    name: 'Bullet Nose',
    cd: 0.25,
    cdClass: 'shapeCdGreen',
    dragLabel: '⬡ Best Aero',
    dragColor: 'var(--green)',
    strokeColor: '#3b82f6',
    detail:
      'Rounded front taper pushes air smoothly to the sides. Slightly harder to carve but excellent drag coefficient. Combine with low profile for best effect. Works especially well on fast, smooth tracks.',
    svg: (
      <svg className={styles.shapeSvg} viewBox="0 0 120 50" width="120" height="50">
        <path d="M10,37 Q10,15 35,15 L100,15 L100,37 Z" fill="#1e2232" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx="25" cy="42" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
        <circle cx="95" cy="42" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'kamm',
    name: 'Kamm-Tail',
    cd: 0.26,
    cdClass: 'shapeCdGreen',
    dragLabel: '⬡ Very Low Drag',
    dragColor: 'var(--green)',
    strokeColor: '#22c55e',
    detail:
      "Truncated tail based on Wunibald Kamm's aerodynamics research. Smooth front taper + abrupt flat rear cut. The abrupt end creates less drag than a long taper — and leaves room for a rear weight pocket. Best of both worlds.",
    svg: (
      <svg className={styles.shapeSvg} viewBox="0 0 120 50" width="120" height="50">
        <path d="M10,38 Q10,15 30,15 L90,15 L90,22 L105,30 L90,38 Z" fill="#1e2232" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="25" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
        <circle cx="90" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'double',
    name: 'Double Wedge',
    cd: 0.27,
    cdClass: 'shapeCdGreen',
    dragLabel: '⬡ Very Low Drag',
    dragColor: 'var(--green)',
    strokeColor: '#f97316',
    detail:
      'Two wedges mirrored front-to-rear, peaking at the center. Diamond profile sheds air efficiently at both ends. Weight pocket goes just behind center peak toward rear. Visually striking and fast.',
    svg: (
      <svg className={styles.shapeSvg} viewBox="0 0 120 50" width="120" height="50">
        <polygon points="10,38 60,15 110,38" fill="#1e2232" stroke="#f97316" strokeWidth="1.5" />
        <line x1="60" y1="15" x2="60" y2="38" stroke="#f97316" strokeWidth="0.8" strokeDasharray="2,2" />
        <circle cx="25" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
        <circle cx="95" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'wedge',
    name: 'Classic Wedge',
    cd: 0.28,
    cdClass: 'shapeCdGreen',
    dragLabel: '⬡ Very Low Drag',
    dragColor: 'var(--green)',
    strokeColor: '#f97316',
    detail:
      'Sloped top from front to rear. Simple to cut from the block. Most popular competitive shape. Front edge angles away air cleanly. Keep front height under 1 inch for best results. Easy to place rear weight pocket.',
    svg: (
      <svg className={styles.shapeSvg} viewBox="0 0 120 50" width="120" height="50">
        <polygon points="10,40 110,40 110,15 10,40" fill="#1e2232" stroke="#f97316" strokeWidth="1.5" />
        <circle cx="25" cy="44" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
        <circle cx="95" cy="44" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'stealth',
    name: 'Low-Profile Rail',
    cd: 0.30,
    cdClass: 'shapeCdGreen',
    dragLabel: '◈ Low Drag',
    dragColor: 'var(--green)',
    strokeColor: '#8b5cf6',
    detail:
      'Flat-sided, minimal cross-section. Reduces frontal area substantially. Often called "ghost" or "stealth" style. Very low profile means weight placement requires more planning. Excellent for experienced builders.',
    svg: (
      <svg className={styles.shapeSvg} viewBox="0 0 120 50" width="120" height="50">
        <polygon points="10,38 110,38 100,15 20,15" fill="#1e2232" stroke="#8b5cf6" strokeWidth="1.5" />
        <circle cx="25" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
        <circle cx="95" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'shark',
    name: 'Shark Fin',
    cd: 0.38,
    cdClass: 'shapeCdYellow',
    dragLabel: '◈ Low-Med Drag',
    dragColor: 'var(--yellow)',
    strokeColor: '#eab308',
    detail:
      'Distinctive tall center fin profile that tapers at both front and rear. Striking visual design with decent aerodynamics. Keep the spine narrow (under ½") to minimize frontal area. Great for scouts who want speed and looks.',
    svg: (
      <svg className={styles.shapeSvg} viewBox="0 0 120 50" width="120" height="50">
        <polygon points="10,38 110,38 90,22 70,15 50,22 30,15 10,38" fill="#1e2232" stroke="#eab308" strokeWidth="1.5" />
        <circle cx="25" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
        <circle cx="95" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'coffin',
    name: 'Coffin / Hex',
    cd: 0.41,
    cdClass: 'shapeCdYellow',
    dragLabel: '◈ Medium Drag',
    dragColor: 'var(--yellow)',
    strokeColor: '#a78bfa',
    detail:
      'Hexagonal coffin shape — angled front corners and tapered rear give a mid-level aero profile. Very easy to cut from the stock block with straight saw cuts. Good for beginners who want better aero than a block without complex carving.',
    svg: (
      <svg className={styles.shapeSvg} viewBox="0 0 120 50" width="120" height="50">
        <polygon points="25,15 95,15 110,25 110,38 10,38 10,25" fill="#1e2232" stroke="#a78bfa" strokeWidth="1.5" />
        <circle cx="25" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
        <circle cx="95" cy="43" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'block',
    name: 'Standard Block',
    cd: 0.52,
    cdClass: 'shapeCdRed',
    dragLabel: '✕ High Drag',
    dragColor: 'var(--red)',
    strokeColor: '#ef4444',
    detail:
      'The default kit shape — avoid for competition. Large flat front face creates maximum drag. Easy to build but costs you ~1–2 car lengths. At least bevel the front edge 45° if you keep this shape.',
    svg: (
      <svg className={styles.shapeSvg} viewBox="0 0 120 50" width="120" height="50">
        <rect x="15" y="15" width="90" height="28" rx="2" fill="#1e2232" stroke="#ef4444" strokeWidth="1.5" />
        <circle cx="30" cy="44" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
        <circle cx="90" cy="44" r="6" fill="#111" stroke="#555" strokeWidth="1.5" />
      </svg>
    ),
  },
];

/* ── Car definitions for race sim ── */
const CAR_DEFINITIONS = [
  { id: 'rc1', name: 'Classic Wedge', emoji: '🟧', color: 'linear-gradient(90deg,#f97316,#fb923c)', Cd: 0.28 },
  { id: 'rc2', name: 'Bullet Nose', emoji: '🟦', color: 'linear-gradient(90deg,#3b82f6,#60a5fa)', Cd: 0.25 },
  { id: 'rc3', name: 'Low-Profile Rail', emoji: '🟪', color: 'linear-gradient(90deg,#8b5cf6,#a78bfa)', Cd: 0.30 },
  { id: 'rc4', name: 'Standard Block', emoji: '🟥', color: 'linear-gradient(90deg,#ef4444,#f87171)', Cd: 0.52 },
  { id: 'rc5', name: 'Kamm-Tail', emoji: '🟩', color: 'linear-gradient(90deg,#22c55e,#4ade80)', Cd: 0.26 },
  { id: 'rc6', name: 'Shark Fin', emoji: '🟨', color: 'linear-gradient(90deg,#eab308,#facc15)', Cd: 0.38 },
  { id: 'rc7', name: 'Double Wedge', emoji: '🔶', color: 'linear-gradient(90deg,#f97316,#dc2626)', Cd: 0.27 },
  { id: 'rc8', name: 'Coffin / Hex', emoji: '🔷', color: 'linear-gradient(90deg,#a78bfa,#7c3aed)', Cd: 0.41 },
];

const DEFAULT_CONFIGS = () => CAR_DEFINITIONS.map((c) => ({ id: c.id, weight: 5.0, cog: 1.0 }));

function computeSpeedScore(cfg, car) {
  const w = cfg.weight;
  const cogCenter = 2.125;
  const rampHeight = 1.22;
  const rampLen = 9.75;
  const rampAngle = Math.asin(rampHeight / rampLen);
  const deltaH = (cogCenter - cfg.cog) * Math.sin(rampAngle) * 0.0254;
  const hEff = rampHeight + deltaH;
  const rollingFactor = 0.88;
  const weightFactor = w / 5.0;
  const dragLoss = car.Cd * 0.18;
  return Math.sqrt(hEff * weightFactor * rollingFactor) * (1 - dragLoss);
}

/* ── Aero tips accordion ── */
const AERO_TIPS = [
  {
    header: 'Keep the front edge low and tapered',
    body: (
      <p>
        The front face of your car slams into still air. A pointed or angled front edge deflects air
        to the sides rather than compressing it. Even a simple 45° bevel on the front of a block
        shape reduces drag noticeably. The lower the profile, the less frontal area.
      </p>
    ),
  },
  {
    header: 'Smooth all transitions and edges',
    body: (
      <p>
        Sharp corners create turbulent airflow (drag spikes). Sand and round every corner and edge
        that air flows over. The smoother the transition from front to sides to top, the better the
        air follows the car&apos;s shape without separating into turbulence.
      </p>
    ),
  },
  {
    header: 'Minimize underbody turbulence',
    body: (
      <p>
        Air rushing under the car creates turbulence around the wheels and axles. A flat, smooth
        underbody — and recessed axle slots if rules allow — reduces this significantly. Some
        builders tape a smooth strip along the bottom sides.
      </p>
    ),
  },
  {
    header: 'Does paint finish matter?',
    body: (
      <p>
        At Pinewood Derby speeds, surface roughness has negligible impact compared to shape. A smooth
        gloss finish is fine, but don&apos;t obsess over paint smoothness when shape and weight are
        much more important. Use that time for car weight and balance verification instead.
      </p>
    ),
  },
];

/* ── Aero checklist items ── */
const AERO_PHASE_1 = [
  { title: 'Choose your body shape', note: 'Pick from the 8 designs above based on your skill level and desired look. Wedge or Bullet Nose recommended for beginners aiming for speed.' },
  { title: 'Sketch the profile on paper first', note: 'Draw a side-view outline to scale (7" x 1¾" roughly). Mark where the axle slots land and where your rear weight pocket will go before cutting anything.' },
  { title: 'Confirm front height will be under 1"', note: 'The lower the front edge, the less frontal area. Plan your cut so the tallest front point is at most 1 inch from the track surface.' },
  { title: 'Mark rear weight pocket location before cutting', note: 'Draw the pocket on the blank — it must be on the underside, within 1" of the rear axle slot, deep enough for your tungsten cubes.' },
];

const AERO_PHASE_2 = [
  { title: 'Cut body profile with coping saw or band saw', note: 'Cut just outside your pencil line — you\'ll sand to final shape. Keep cuts slow and controlled. Adult supervision required.' },
  { title: 'Drill rear weight pocket', note: 'Use a drill press if possible. Multiple overlapping holes or a Forstner bit works well. Stay at least ¼" from axle slots and outer edges.' },
  { title: 'Bevel or round all leading edges', note: 'Any edge that air hits first should be angled or rounded — especially the front face. A 45° chamfer on the front dramatically cuts drag even on a block shape.' },
  { title: 'Taper or round trailing edges where possible', note: 'The rear of the car also affects air separation. A slight taper or the Kamm-style flat cut both reduce turbulence wake behind the car.' },
  { title: 'Flatten and smooth the underbody', note: 'Sand the bottom face flat. Turbulence under the car (around the axles) is a hidden drag source. A smooth, flush bottom helps reduce it.' },
];

const AERO_PHASE_3 = [
  { title: 'Sand body with 80 → 120 → 220 grit', note: 'Work through progressively finer grits. Always sand with the wood grain. Remove all tool marks and sharp transitions between cut faces.' },
  { title: 'Apply wood sealer or sanding primer', note: 'Bare pine absorbs paint unevenly and raises grain. A thin coat of sanding sealer or primer locks the grain down and gives a smoother paint surface.' },
  { title: 'Light sand after primer (320 grit)', note: 'Primer raises the grain slightly. A quick pass with 320 grit after it dries knocks down any raised fibers before the color coat.' },
  { title: 'Paint and decorate', note: 'Thin, even coats. Let each coat dry fully. 2–3 thin coats beat 1 thick coat every time — thick paint can drip, run, and add uneven weight.' },
  { title: 'Apply clear coat or lacquer', note: 'A gloss clear coat seals the paint and gives the smoothest possible surface finish. 2 light coats. Let fully cure before installing weights and axles.' },
];

const AERO_PHASE_4 = [
  { title: 'Re-verify CoG after painting', note: 'Paint adds a small amount of weight — unevenly. Balance on your pencil again after all coats are dry. Adjust weights if CoG has shifted.' },
  { title: 'Check minimum ground clearance (≥ 3/8")', note: 'Hold a 3/8" drill bit or gauge under the center of the car. It must pass freely — if not, you risk hitting the track center rail and DQ.' },
  { title: 'Confirm width is ≤ 2¾"', note: 'Measure at the widest point. Including the wheels if your design is at max width. The official BSA width gauge at impound will catch any overwidth car.' },
  { title: 'Confirm length is ≤ 7"', note: 'Measure tip to tail. Even decorative bumpers or nose pieces count toward total length.' },
  { title: 'All decorations are firmly attached', note: 'Stickers, decals, paint details — anything loose can fly off on the track, change weight distribution, or cause a DQ. Press down all edges firmly.' },
];

const TOTAL_AERO = AERO_PHASE_1.length + AERO_PHASE_2.length + AERO_PHASE_3.length + AERO_PHASE_4.length;

export default function AeroTab() {
  const [selectedShape, setSelectedShape] = useState(null);
  const [carConfigs, setCarConfigs] = useState(DEFAULT_CONFIGS);
  const [raceRunning, setRaceRunning] = useState(false);
  const [positions, setPositions] = useState(new Array(8).fill(0));
  const [finishTimes, setFinishTimes] = useState(new Array(8).fill(null));
  const [ranks, setRanks] = useState(new Array(8).fill(null));
  const [raceResult, setRaceResult] = useState(null);

  const [phaseProgress, setPhaseProgress] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });

  const raceFrameRef = useRef(null);
  const raceStateRef = useRef(null);
  const trackRefs = useRef([]);

  const totalDone = phaseProgress[1] + phaseProgress[2] + phaseProgress[3] + phaseProgress[4];
  const aeroPct = TOTAL_AERO ? Math.round((totalDone / TOTAL_AERO) * 100) : 0;

  let aeroSummary;
  if (aeroPct === 0) aeroSummary = 'Check off items as you complete each step.';
  else if (aeroPct < 30) aeroSummary = `Good start — ${totalDone} of ${TOTAL_AERO} steps done. Keep going!`;
  else if (aeroPct < 60) aeroSummary = `Making progress — ${totalDone} of ${TOTAL_AERO} steps done. Body shaping underway.`;
  else if (aeroPct < 85) aeroSummary = `Almost there — ${totalDone} of ${TOTAL_AERO} steps done. Finishing phase in sight!`;
  else if (aeroPct < 100) aeroSummary = `Nearly complete — ${totalDone} of ${TOTAL_AERO} steps done. Almost race-ready!`;
  else aeroSummary = `✅ All ${TOTAL_AERO} aero steps complete — your car is shape-optimized and ready!`;

  const makePhaseHandler = useCallback((phase) => ({ done }) => {
    setPhaseProgress((prev) => ({ ...prev, [phase]: done }));
  }, []);

  const updateCarWeight = useCallback((id, val) => {
    setCarConfigs((prev) => prev.map((c) => (c.id === id ? { ...c, weight: parseFloat(val) } : c)));
  }, []);

  const updateCarCog = useCallback((id, val) => {
    setCarConfigs((prev) => prev.map((c) => (c.id === id ? { ...c, cog: parseFloat(val) } : c)));
  }, []);

  const resetCarDefaults = useCallback(() => {
    setCarConfigs(DEFAULT_CONFIGS());
    resetRace();
  }, []);

  const resetRace = useCallback(() => {
    if (raceFrameRef.current) cancelAnimationFrame(raceFrameRef.current);
    raceStateRef.current = null;
    setRaceRunning(false);
    setPositions(new Array(8).fill(0));
    setFinishTimes(new Array(8).fill(null));
    setRanks(new Array(8).fill(null));
    setRaceResult(null);
  }, []);

  const startRace = useCallback(() => {
    if (raceRunning) {
      resetRace();
      return;
    }
    resetRace();

    const scores = CAR_DEFINITIONS.map((car, i) => ({
      car,
      score: computeSpeedScore(carConfigs[i], car),
      cfg: carConfigs[i],
    }));
    const maxScore = Math.max(...scores.map((s) => s.score));
    const speeds = scores.map((s) => s.score / maxScore);

    const state = {
      positions: new Array(8).fill(0),
      finished: new Array(8).fill(false),
      finishTimes: new Array(8).fill(null),
      ranks: new Array(8).fill(null),
      rankCounter: 0,
      startTime: performance.now(),
      speeds,
      baseRate: 0.22,
      RACE_DURATION_BASELINE: 4.2,
    };
    raceStateRef.current = state;
    setRaceRunning(true);

    function frame(now) {
      const s = raceStateRef.current;
      if (!s) return;

      const rampPct = 0.40;

      CAR_DEFINITIONS.forEach((car, i) => {
        if (s.finished[i]) return;
        const pct = s.positions[i] / 100;
        const accelPhase = pct < rampPct ? pct / rampPct : 1.0;
        const speed = s.speeds[i] * s.baseRate * (0.3 + 0.7 * accelPhase);
        s.positions[i] += speed * (1 + (Math.random() - 0.5) * 0.01);

        if (s.positions[i] >= 100) {
          s.finished[i] = true;
          s.rankCounter++;
          const elapsed = (now - s.startTime) / 1000;
          s.finishTimes[i] = elapsed;
          s.ranks[i] = s.rankCounter;
        }
      });

      setPositions([...s.positions]);
      setFinishTimes([...s.finishTimes]);
      setRanks([...s.ranks]);

      if (s.finished.every(Boolean)) {
        setRaceRunning(false);
        const winnerIdx = s.finishTimes.indexOf(Math.min(...s.finishTimes.filter((t) => t !== null)));
        const winner = CAR_DEFINITIONS[winnerIdx];
        const winnerCfg = carConfigs[winnerIdx];
        setRaceResult({
          name: winner.name,
          weight: winnerCfg.weight,
          cog: winnerCfg.cog,
          cd: winner.Cd,
        });
        raceStateRef.current = null;
        return;
      }

      raceFrameRef.current = requestAnimationFrame(frame);
    }

    raceFrameRef.current = requestAnimationFrame(frame);
  }, [raceRunning, carConfigs, resetRace]);

  useEffect(() => {
    return () => {
      if (raceFrameRef.current) cancelAnimationFrame(raceFrameRef.current);
    };
  }, []);

  return (
    <>
      <div className={styles.sectionTitle}>
        Aero<span>dynamics</span>
      </div>
      <p className={styles.sectionIntro}>
        At Pinewood Derby speeds (~10–15 mph), aerodynamic drag is real — a good shape over a
        block can net 1–2 car lengths. All 8 designs are shown below ranked by drag, then put
        them head-to-head in the race simulator. Click any shape card for build notes.
      </p>

      {/* 8 Shape Cards */}
      <div className={styles.shapesGrid}>
        {SHAPES.map((shape) => {
          const isSelected = selectedShape === shape.id;
          return (
            <div
              key={shape.id}
              className={`${styles.shapeCard}${isSelected ? ` ${styles.shapeCardSelected}` : ''}`}
              onClick={() => setSelectedShape(isSelected ? null : shape.id)}
            >
              <div className={`${styles.shapeCdBadge} ${styles[shape.cdClass]}`}>Cd {shape.cd.toFixed(2)}</div>
              {shape.svg}
              <div className={styles.shapeName}>{shape.name}</div>
              <div className={styles.shapeDrag} style={{ color: shape.dragColor }}>
                {shape.dragLabel}
              </div>
              {isSelected && <div className={styles.shapeDetail}>{shape.detail}</div>}
            </div>
          );
        })}
      </div>

      <p className={styles.shapesCaption}>
        ↑ Sorted best → worst aerodynamics · Click any card for build notes · Cd
        values used directly in the race simulator below
      </p>

      {/* Race Simulator */}
      <div className={styles.raceSim}>
        <Card
          icon="🏎️"
          title="Shape & Weight Race Simulator"
          style={{ background: 'transparent', border: 'none', padding: 0 }}
        >
          <p className={styles.raceSimDesc}>
            Each lane corresponds to a shape above. Adjust weight (1–5 oz) and CoG per car, then
            race. Physics model: heavier + rear CoG + low Cd = faster.
          </p>

          {/* Config panel */}
          <div className={styles.configPanel}>
            <div className={styles.configTitle}>Car Configuration — Weight & CoG per Shape</div>
            <div className={styles.configGrid}>
              {CAR_DEFINITIONS.map((car, i) => {
                const cfg = carConfigs[i];
                return (
                  <div key={car.id} className={styles.configCard}>
                    <div className={styles.configCardHeader}>
                      <div className={styles.configColorDot} style={{ background: car.color }} />
                      <span className={styles.configCarName}>{car.name}</span>
                    </div>
                    <div className={styles.configCd}>Cd = {car.Cd.toFixed(2)}</div>
                    <div className={styles.configSliderRow}>
                      <span>Weight</span>
                      <span className={styles.configSliderValueOrange}>{cfg.weight.toFixed(1)} oz</span>
                    </div>
                    <input
                      type="range"
                      className={styles.configRangeInput}
                      min="1"
                      max="5"
                      step="0.1"
                      value={cfg.weight}
                      onChange={(e) => updateCarWeight(car.id, e.target.value)}
                    />
                    <div className={styles.configSliderRow}>
                      <span>CoG from rear</span>
                      <span className={styles.configSliderValueBlue}>{cfg.cog.toFixed(1)}&quot;</span>
                    </div>
                    <input
                      type="range"
                      className={styles.configRangeInputSmall}
                      min="0.5"
                      max="3.5"
                      step="0.1"
                      value={cfg.cog}
                      onChange={(e) => updateCarCog(car.id, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Race lanes */}
          <div>
            {CAR_DEFINITIONS.map((car, i) => {
              const pos = Math.min(positions[i] / 100, 1);
              const scaledTime =
                finishTimes[i] !== null
                  ? (4.2 / (raceStateRef.current?.speeds?.[i] || 1)).toFixed(2)
                  : null;
              const rank = ranks[i];
              return (
                <div key={car.id} className={styles.raceLane}>
                  <div className={styles.raceLaneLabel}>{car.name}</div>
                  <div
                    className={styles.raceTrack}
                    ref={(el) => { trackRefs.current[i] = el; }}
                  >
                    <div
                      className={styles.raceCar}
                      style={{
                        background: car.color,
                        left: `calc(${pos * 100}% - ${pos * 30}px)`,
                      }}
                    >
                      {'🏁'}
                    </div>
                  </div>
                  <div className={styles.raceTime}>{scaledTime ? `${scaledTime}s` : '—'}</div>
                  <div
                    className={styles.raceRank}
                    style={{
                      color: rank === 1 ? '#f97316' : rank && rank <= 3 ? '#22c55e' : 'var(--text3)',
                    }}
                  >
                    {rank ? `#${rank}` : ''}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.raceButtons}>
            <button className={styles.btn} onClick={startRace}>
              {raceRunning ? '■ Stop' : raceResult ? '▶ Race Again' : '▶ Start Race'}
            </button>
            <button className={styles.btnGhost} onClick={resetRace}>
              ↺ Reset
            </button>
            <button className={styles.btnGhost} onClick={resetCarDefaults} style={{ fontSize: '0.78rem' }}>
              ⟳ Default Configs
            </button>
          </div>

          {raceResult && (
            <div className={styles.raceResult}>
              {'🏆'}{' '}
              <strong style={{ color: 'var(--accent)' }}>{raceResult.name}</strong> wins!{' '}
              &nbsp;({raceResult.weight.toFixed(1)} oz · CoG {raceResult.cog.toFixed(1)}&quot;
              from rear · Cd {raceResult.cd.toFixed(2)}) &mdash; Try adjusting weights and CoG
              to see different outcomes.
            </div>
          )}
        </Card>
      </div>

      {/* Aero Tips Accordion */}
      <Card icon="💡" title="Aero Optimization Tips" style={{ marginTop: '1.5rem' }}>
        <Accordion items={AERO_TIPS} />
      </Card>

      {/* Aero Build Checklist */}
      <Card style={{ marginTop: '1.5rem' }}>
        <div className={styles.checklistHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{'✅'}</span>
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.4rem',
                letterSpacing: '0.08em',
                color: 'var(--accent)',
              }}
            >
              Aerodynamics Build Checklist
            </h3>
          </div>
          <div className={styles.checklistHeaderRight}>
            <div className={styles.checklistPct}>{aeroPct}%</div>
          </div>
        </div>
        <ProgressBar value={aeroPct} />

        <div className={styles.phaseLabel} style={{ marginTop: '1.2rem' }}>{'①'} Planning</div>
        <Checklist storageKey="pwd-aero-phase1" items={AERO_PHASE_1} onProgressChange={makePhaseHandler(1)} />

        <div className={styles.phaseLabelSpaced}>{'②'} Cutting & Shaping</div>
        <Checklist storageKey="pwd-aero-phase2" items={AERO_PHASE_2} onProgressChange={makePhaseHandler(2)} />

        <div className={styles.phaseLabelSpaced}>{'③'} Sanding & Finishing</div>
        <Checklist storageKey="pwd-aero-phase3" items={AERO_PHASE_3} onProgressChange={makePhaseHandler(3)} />

        <div className={styles.phaseLabelSpaced}>{'④'} Final Aero Verify</div>
        <Checklist storageKey="pwd-aero-phase4" items={AERO_PHASE_4} onProgressChange={makePhaseHandler(4)} />

        <div className={styles.summaryBar} style={{ color: aeroPct === 100 ? 'var(--green)' : 'var(--text3)' }}>
          {aeroSummary}
        </div>
      </Card>
    </>
  );
}
