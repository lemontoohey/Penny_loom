import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';

const GOLD = '#c9a227';
const NAVY = '#0e1628';
const WOOD = '#6b4423';
const WOOD_LIGHT = '#8a5a30';
const CREAM = 'rgba(245,240,232,0.85)';
const RUST = '#8b3a2a';

// Peg positions on a warping board (viewBox 0 0 700 420)
const PEGS = {
  crossA: { cx: 100, cy: 80, id: 'crossA', label: 'Cross peg A' },
  crossB: { cx: 180, cy: 80, id: 'crossB', label: 'Cross peg B' },
  p1:     { cx: 620, cy: 80,  id: 'p1', label: 'Length peg 1' },
  p2:     { cx: 620, cy: 200, id: 'p2', label: 'Length peg 2' },
  p3:     { cx: 620, cy: 340, id: 'p3', label: 'Length peg 3' },
  far:    { cx: 100, cy: 340, id: 'far', label: 'Far peg' },
};

// Thread path for ONE warp end (the figure-8 and perimeter route)
// Each segment: { from, to, over } — over = which peg the yarn goes OVER
const STEPS = [
  {
    id: 0,
    title: 'Tie on and start',
    desc: 'Tie a slip knot around Cross Peg A (the first of the two cross pegs). This is where every thread begins.',
    highlight: ['crossA'],
    path: null,
  },
  {
    id: 1,
    title: 'Over A, under B — the first half of the cross',
    desc: 'Bring the yarn OVER Cross Peg A, then pass it UNDER Cross Peg B. This begins the figure-8 that creates the cross.',
    highlight: ['crossA', 'crossB'],
    path: { points: [[100, 80], [180, 80]], color: GOLD, arrow: true },
  },
  {
    id: 2,
    title: 'Wind out to the far peg',
    desc: 'Continue the thread out to the right along the top rail, around the far pegs, and all the way to the Far Peg. This length determines how long your warp threads are.',
    highlight: ['p1', 'p2', 'p3', 'far'],
    path: { points: [[180, 80], [620, 80], [620, 200], [620, 340], [100, 340]], color: GOLD, arrow: false },
  },
  {
    id: 3,
    title: 'Wind back — over B, under A',
    desc: 'Head back up the board toward the cross pegs. This time, go OVER Cross Peg B and UNDER Cross Peg A — the OPPOSITE of the first pass. This is what makes the figure-8 cross.',
    highlight: ['crossA', 'crossB'],
    path: { points: [[100, 340], [620, 340], [620, 200], [620, 80], [180, 80], [100, 80]], color: RUST, arrow: true },
  },
  {
    id: 4,
    title: 'One thread complete — repeat!',
    desc: 'You\'ve wound one complete warp end. Without cutting, wind back over A, under B again to start the next thread. The cross builds up as a beautiful X between the two pegs.',
    highlight: ['crossA', 'crossB', 'far'],
    path: null,
  },
  {
    id: 5,
    title: 'Secure the cross with a lease stick tie',
    desc: 'When all threads are wound, tie the cross securely with figure-8 ties before removing the warp from the board. This is the most important step — never skip it.',
    highlight: ['crossA', 'crossB'],
    path: null,
  },
];

function WarpingBoardSVG({ step, completedSteps }: { step: number; completedSteps: number[] }) {
  const currentStep = STEPS[step];
  const isHighlighted = (id: string) => currentStep?.highlight?.includes(id) ?? false;

  // Build up the path lines based on completed steps
  const drawnPaths = STEPS.filter((s, i) => i <= step && s.path);

  return (
    <svg viewBox="0 0 700 420" className="w-full h-auto max-h-[340px]">
      {/* Board background */}
      <rect width="700" height="420" fill={NAVY} rx="12" />
      <rect x="40" y="40" width="620" height="340" rx="8" fill="#12213a" stroke="#243050" strokeWidth="1.5" />

      {/* Board frame */}
      <rect x="40" y="40" width="620" height="10" fill={WOOD_LIGHT} rx="4" />
      <rect x="40" y="370" width="620" height="10" fill={WOOD} rx="4" />
      <rect x="40" y="40" width="10" height="340" fill={WOOD} rx="4" />
      <rect x="650" y="40" width="10" height="340" fill={WOOD} rx="4" />

      {/* Length guide label */}
      <text x="650" y="215" fill="#243050" fontSize="10" transform="rotate(90, 650, 215)" textAnchor="middle">WARP LENGTH →</text>

      {/* Drawn yarn paths (accumulated) */}
      {drawnPaths.map((s) => {
        if (!s.path) return null;
        const pts = s.path.points;
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
        return (
          <motion.path
            key={s.id}
            d={d}
            fill="none"
            stroke={s.path.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        );
      })}

      {/* Show accumulated previous threads (faded) */}
      {completedSteps.length > 1 && step >= 4 && (
        <>
          {[0, 1].map((offset) => (
            <g key={offset} opacity={0.2}>
              <path
                d="M 100 80 L 620 80 L 620 200 L 620 340 L 100 340 L 620 340 L 620 200 L 620 80 L 100 80"
                fill="none" stroke={GOLD} strokeWidth="2"
              />
            </g>
          ))}
        </>
      )}

      {/* Cross X indicator between pegs */}
      {step >= 1 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <line x1="100" y1="65" x2="180" y2="95" stroke={GOLD} strokeWidth="2" opacity="0.6" />
          <line x1="180" y1="65" x2="100" y2="95" stroke={RUST} strokeWidth="2" opacity="0.6" />
          <text x="140" y="108" textAnchor="middle" fill="#c9a227" fontSize="9" fontStyle="italic">cross</text>
        </motion.g>
      )}

      {/* Pegs */}
      {Object.values(PEGS).map((peg) => {
        const hi = isHighlighted(peg.id);
        return (
          <motion.g key={peg.id} animate={{ scale: hi ? 1.2 : 1 }} style={{ transformOrigin: `${peg.cx}px ${peg.cy}px` }}>
            <circle cx={peg.cx} cy={peg.cy} r="12" fill={hi ? GOLD : WOOD} stroke={hi ? '#e0bc45' : WOOD_LIGHT} strokeWidth="2" />
            <circle cx={peg.cx} cy={peg.cy} r="5" fill={hi ? '#fff8e0' : '#2a1408'} />
          </motion.g>
        );
      })}

      {/* Peg labels — only on highlighted pegs */}
      {Object.values(PEGS).map((peg) => {
        if (!isHighlighted(peg.id)) return null;
        const above = peg.cy < 200;
        return (
          <text
            key={`label-${peg.id}`}
            x={peg.cx}
            y={above ? peg.cy - 18 : peg.cy + 26}
            textAnchor="middle"
            fill={GOLD}
            fontSize="10"
            fontWeight="600"
          >
            {peg.label}
          </text>
        );
      })}

      {/* Step counter */}
      <text x="24" y="418" fill="#243050" fontSize="9">Step {step + 1}/{STEPS.length}</text>
    </svg>
  );
}

interface WarpingBoardGuideProps {
  onComplete: () => void;
}

export function WarpingBoardGuide({ onComplete }: WarpingBoardGuideProps) {
  const { setChatOpen } = useGameStore();
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  const allDone = completedSteps.length === STEPS.length;

  function handleNext() {
    setCompletedSteps((prev) => [...new Set([...prev, step])]);
    if (!isLastStep) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-loom-cream mb-1">Using the Warping Board</h2>
        <p className="text-loom-muted text-sm">
          Follow the steps to learn how to wind a warp. The cross (figure-8) is the most critical part — it keeps every thread in order for threading.
        </p>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            className={`transition-all duration-200 rounded-full ${
              i === step
                ? 'w-6 h-2.5 bg-loom-gold'
                : completedSteps.includes(i)
                ? 'w-2.5 h-2.5 bg-loom-sage'
                : 'w-2.5 h-2.5 bg-loom-border'
            }`}
          />
        ))}
        <span className="text-loom-muted text-xs ml-2">
          {step + 1} / {STEPS.length}
        </span>
      </div>

      {/* SVG diagram */}
      <div className="bg-[#0e1628] rounded-2xl p-3 border border-loom-border">
        <WarpingBoardSVG step={step} completedSteps={completedSteps} />
      </div>

      {/* Step info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="bg-loom-raised border border-loom-border rounded-xl p-4 space-y-1"
        >
          <div className="flex items-center gap-2">
            <span className="bg-loom-gold text-loom-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
              {step + 1}
            </span>
            <h3 className="text-loom-cream font-semibold text-base">{currentStep.title}</h3>
          </div>
          <p className="text-loom-cream/85 text-sm leading-relaxed pl-7">
            {currentStep.desc}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Key concept callouts */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-loom-gold/10 border border-loom-gold/25 rounded-xl p-3 flex gap-2">
          <span className="text-base flex-shrink-0">💡</span>
          <p className="text-loom-cream/80 text-xs leading-relaxed">
            <strong className="text-loom-gold">Over A, Under B</strong> — the golden rule. Say it as you wind. This alternation is what makes the cross work.
          </p>
        </motion.div>
      )}
      {step === 5 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-loom-rust/20 border border-loom-rust/30 rounded-xl p-3 flex gap-2">
          <span className="text-base flex-shrink-0">⚠️</span>
          <p className="text-loom-cream/80 text-xs leading-relaxed">
            <strong className="text-white">Never remove the warp without securing the cross first.</strong> Tie a figure-8 tie through the cross loop and another tie around the whole warp 30 cm from the cross. Use a contrasting yarn colour so you can find it later.
          </p>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button onClick={handlePrev} className="btn-ghost text-xs px-4 py-2 rounded-lg">
              ← Back
            </button>
          )}
          <button
            onClick={() => setChatOpen(true)}
            className="text-loom-muted text-xs hover:text-loom-gold transition-colors"
          >
            🐦 Ask Wren
          </button>
        </div>

        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          {isLastStep ? 'Got it — what\'s next? →' : 'Next step →'}
        </motion.button>
      </div>
    </div>
  );
}
