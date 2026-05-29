import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';

// Straight-draw threading: 12 threads, pattern 1-2-3-4 repeating
const TARGET: number[] = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4];
const SHAFT_COLORS = ['#c9a227', '#8b3a2a', '#4e8a5e', '#5a6fa0'];
const SHAFT_NAMES = ['Shaft 1', 'Shaft 2', 'Shaft 3', 'Shaft 4'];
const SHAFT_SHORT = ['S1', 'S2', 'S3', 'S4'];
const THREAD_COLORS = [
  '#d4a56a', '#c9a227', '#b8891a', '#a87810',
  '#d4a56a', '#c9a227', '#b8891a', '#a87810',
  '#d4a56a', '#c9a227', '#b8891a', '#a87810',
];

type SlotState = 'empty' | 'correct' | 'wrong-shake';

interface ThreadingSimulatorProps {
  onComplete: () => void;
}

export function ThreadingSimulator({ onComplete }: ThreadingSimulatorProps) {
  const { addXP, setChatOpen } = useGameStore();

  const [threaded, setThreaded] = useState<(number | null)[]>(Array(TARGET.length).fill(null));
  const [current, setCurrent] = useState(0);  // index of thread being threaded (right to left = index 11..0)
  const [slotState, setSlotState] = useState<SlotState>('empty');
  const [wrongGuess, setWrongGuess] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Threading goes RIGHT to LEFT — so current starts at index 11 and counts down
  const threadIndex = TARGET.length - 1 - current; // convert current position to array index
  const correctShaft = TARGET[threadIndex];
  const remaining = TARGET.length - current;

  function handleShaftClick(shaft: number) {
    if (slotState === 'wrong-shake' || done) return;

    if (shaft === correctShaft) {
      // Correct!
      addXP(5, `Threaded thread ${threadIndex + 1} onto shaft ${shaft}`);
      const newThreaded = [...threaded];
      newThreaded[threadIndex] = shaft;
      setThreaded(newThreaded);
      setSlotState('correct');
      setShowHint(false);

      setTimeout(() => {
        setSlotState('empty');
        if (current + 1 >= TARGET.length) {
          setDone(true);
          onComplete();
        } else {
          setCurrent((c) => c + 1);
        }
      }, 400);
    } else {
      // Wrong
      setMistakes((m) => m + 1);
      setWrongGuess(shaft);
      setSlotState('wrong-shake');
      setTimeout(() => {
        setSlotState('empty');
        setWrongGuess(null);
      }, 600);
    }
  }

  const progressPct = (current / TARGET.length) * 100;
  const correctCount = threaded.filter((t) => t !== null).length;

  if (done) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
        <div className="text-6xl mb-3">🪡</div>
        <h3 className="text-2xl font-bold text-loom-cream">Threading complete!</h3>
        <p className="text-loom-muted text-sm">
          All 12 threads threaded correctly · {mistakes === 0 ? '✨ Perfect run!' : `${mistakes} mistake${mistakes !== 1 ? 's' : ''}`}
        </p>
        {mistakes === 0 && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-loom-gold/20 border border-loom-gold/30 rounded-full px-4 py-2"
          >
            <span>⭐</span>
            <span className="text-loom-gold text-sm font-semibold">Perfect threading!</span>
          </motion.div>
        )}
        <p className="text-loom-muted text-xs mt-2">+{5 * TARGET.length} XP earned from threading</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-loom-cream mb-1">Threading Simulator</h2>
        <p className="text-loom-muted text-sm">
          Thread a straight draw (1–2–3–4 repeat) across 12 threads, right to left. Click the correct shaft for each thread.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-loom-raised rounded-full overflow-hidden">
          <motion.div className="h-full bg-loom-gold rounded-full" animate={{ width: `${progressPct}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span className="text-loom-muted text-xs">{correctCount}/{TARGET.length} threaded</span>
      </div>

      {/* The loom — all 12 thread columns */}
      <div className="bg-[#0d1525] border border-loom-border rounded-xl p-4">
        <p className="text-loom-muted text-[10px] uppercase tracking-wider mb-3">Threading draft — straight draw (right to left)</p>

        {/* Draft grid showing progress */}
        <div className="overflow-x-auto pb-1">
          <svg width={TARGET.length * 30 + 32} height={4 * 26 + 28} style={{ display: 'block' }}>
            {/* Shaft labels */}
            {[3, 2, 1, 0].map((row) => (
              <text key={row} x={16} y={row * 26 + 19} textAnchor="middle" fill="#6a7a8a" fontSize="9" fontWeight="600">
                S{4 - row}
              </text>
            ))}

            {/* Grid cells */}
            {[0, 1, 2, 3].map((row) =>
              TARGET.map((_, col) => {
                const tIdx = TARGET.length - 1 - col; // rightmost thread = index 11
                const isCurrentCol = tIdx === threadIndex;
                const isThreaded = threaded[tIdx] !== null;
                return (
                  <rect
                    key={`bg-${row}-${col}`}
                    x={col * 30 + 28} y={row * 26 + 4}
                    width={27} height={23}
                    fill={isCurrentCol ? 'rgba(201,162,39,0.15)' : '#0d1525'}
                    stroke={isCurrentCol ? 'rgba(201,162,39,0.5)' : '#1e2d4a'}
                    strokeWidth="0.5"
                    rx="2"
                  />
                );
              })
            )}

            {/* Filled squares (threaded so far) */}
            {TARGET.map((shaft, tIdx) => {
              if (threaded[tIdx] === null) return null;
              const col = TARGET.length - 1 - tIdx;
              const row = 4 - shaft;
              return (
                <motion.rect
                  key={`fill-${tIdx}`}
                  x={col * 30 + 30} y={row * 26 + 6}
                  width={23} height={19}
                  fill={SHAFT_COLORS[shaft - 1]}
                  rx="2"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              );
            })}

            {/* Current thread marker */}
            {!done && (
              <motion.rect
                x={(TARGET.length - 1 - threadIndex) * 30 + 29}
                y={0}
                width={28}
                height={4 * 26 + 6}
                fill="none"
                stroke="#c9a227"
                strokeWidth="1.5"
                strokeDasharray="3 2"
                rx="3"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Thread numbers */}
            {TARGET.map((_, tIdx) => {
              const col = TARGET.length - 1 - tIdx;
              const isActive = tIdx === threadIndex;
              return (
                <text
                  key={`num-${tIdx}`}
                  x={col * 30 + 28 + 13}
                  y={4 * 26 + 22}
                  textAnchor="middle"
                  fill={isActive ? '#c9a227' : '#3a4a5a'}
                  fontSize="9"
                  fontWeight={isActive ? '700' : '400'}
                >
                  {tIdx + 1}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Thread being threaded now */}
        <div className="mt-3 pt-3 border-t border-loom-border flex items-center gap-3">
          <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: THREAD_COLORS[threadIndex] }} />
          <div>
            <span className="text-loom-muted text-xs">Threading now:</span>
            <span className="text-loom-cream font-semibold text-sm ml-2">Thread {threadIndex + 1}</span>
            <span className="text-loom-muted text-xs ml-2">({remaining} remaining)</span>
          </div>
        </div>
      </div>

      {/* Shaft selector buttons */}
      <div>
        <p className="text-loom-muted text-xs mb-3 uppercase tracking-wider">
          Which shaft does thread {threadIndex + 1} go through?
        </p>
        <motion.div
          animate={slotState === 'wrong-shake' ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-4 gap-3"
        >
          {[1, 2, 3, 4].map((shaft) => {
            const isWrong = slotState === 'wrong-shake' && wrongGuess === shaft;
            const isCorrect = slotState === 'correct' && shaft === correctShaft;
            return (
              <motion.button
                key={shaft}
                onClick={() => handleShaftClick(shaft)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`
                  relative py-5 rounded-xl border-2 font-bold text-lg transition-all duration-150
                  ${isCorrect
                    ? 'border-loom-sage bg-loom-sage/20 text-white'
                    : isWrong
                    ? 'border-red-500 bg-red-900/30 text-red-300'
                    : 'border-loom-border bg-loom-raised text-loom-cream hover:border-opacity-80'}
                `}
                style={
                  !isCorrect && !isWrong
                    ? { borderColor: `${SHAFT_COLORS[shaft - 1]}60` }
                    : {}
                }
              >
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1.5"
                  style={{ backgroundColor: SHAFT_COLORS[shaft - 1] }}
                />
                {SHAFT_SHORT[shaft - 1]}
                {isCorrect && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center text-2xl"
                  >
                    ✓
                  </motion.div>
                )}
                {isWrong && <div className="absolute inset-0 flex items-center justify-center text-2xl">✗</div>}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Hint + ask Wren */}
      <div className="flex items-center justify-between">
        <button onClick={() => setChatOpen(true)} className="text-loom-muted text-xs hover:text-loom-gold transition-colors">
          🐦 Ask Wren
        </button>
        <div className="flex items-center gap-3">
          {mistakes > 0 && (
            <span className="text-loom-muted text-xs">{mistakes} mistake{mistakes !== 1 ? 's' : ''}</span>
          )}
          <button
            onClick={() => setShowHint((v) => !v)}
            className="text-loom-muted text-xs hover:text-loom-gold transition-colors underline underline-offset-2"
          >
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-loom-gold/10 border border-loom-gold/25 rounded-xl p-3 flex gap-2"
          >
            <span className="text-sm">💡</span>
            <p className="text-loom-cream/80 text-xs leading-relaxed">
              For a straight draw, the shaft number follows the sequence 1, 2, 3, 4, 1, 2, 3, 4…
              Thread {threadIndex + 1} is position {(threadIndex % 4) + 1} in the repeat — so it goes on{' '}
              <strong className="text-loom-gold">Shaft {correctShaft}</strong>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
