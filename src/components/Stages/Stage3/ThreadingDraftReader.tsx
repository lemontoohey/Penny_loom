import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';

// Threading patterns to show
const PATTERNS = [
  {
    id: 'straight',
    name: 'Straight Draw',
    desc: 'The most fundamental 4-shaft threading. Threads climb 1→2→3→4 and repeat. Works for plain weave, twills, and more.',
    difficulty: 'Beginner',
    threads: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
    color: '#c9a227',
    structures: ['Plain weave', '2/2 Twill', '1/3 Twill', 'Basket weave'],
  },
  {
    id: 'point',
    name: 'Point Twill',
    desc: 'Threads go up 1→4 then reverse 4→1. Creates a "V" shape in the draft — this gives you herringbone and chevrons.',
    difficulty: 'Beginner',
    threads: [1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 3, 2],
    color: '#8b3a2a',
    structures: ['Herringbone', 'Chevron twill', 'Point rosepath'],
  },
  {
    id: 'rosepath',
    name: 'Rosepath',
    desc: 'A traditional Scandinavian threading: 1,2,3,2,1,2,3,4,3,2. Creates beautiful rose-like patterns with the right tie-up.',
    difficulty: 'Intermediate',
    threads: [1, 2, 3, 2, 1, 2, 3, 4, 3, 2, 1, 2],
    color: '#4e8a5e',
    structures: ['Rosepath', 'M\'s and O\'s (variant)', 'Twill blocks'],
  },
];

const SHAFT_COLORS = ['#c9a227', '#8b3a2a', '#4e8a5e', '#5a6fa0'];
const SHAFT_LABELS = ['S1', 'S2', 'S3', 'S4'];

function DraftGrid({ threads, activeThread = -1, color }: {
  threads: number[];
  activeThread?: number;
  color: string;
}) {
  const CELL = 28;
  const shafts = 4;
  const cols = threads.length;

  return (
    <div className="overflow-x-auto">
      <svg
        width={cols * CELL + 36}
        height={shafts * CELL + 28}
        style={{ display: 'block' }}
      >
        {/* Shaft labels */}
        {[3, 2, 1, 0].map((row) => (
          <text
            key={row}
            x={16}
            y={row * CELL + CELL / 2 + 6 + 6}
            textAnchor="middle"
            fill="#9a8f84"
            fontSize="10"
            fontWeight="600"
          >
            {SHAFT_LABELS[3 - row]}
          </text>
        ))}

        {/* Grid background */}
        {Array.from({ length: shafts }, (_, row) =>
          Array.from({ length: cols }, (_, col) => (
            <rect
              key={`bg-${row}-${col}`}
              x={col * CELL + 28}
              y={row * CELL + 6}
              width={CELL - 1}
              height={CELL - 1}
              fill={col === activeThread ? 'rgba(201,162,39,0.12)' : '#131929'}
              stroke="#243050"
              strokeWidth="0.5"
              rx="2"
            />
          ))
        )}

        {/* Filled squares */}
        {threads.map((shaft, col) => {
          const row = shafts - shaft; // invert: shaft 4 = row 0
          const isActive = col === activeThread;
          return (
            <motion.rect
              key={`fill-${col}`}
              x={col * CELL + 30}
              y={row * CELL + 8}
              width={CELL - 5}
              height={CELL - 5}
              fill={isActive ? '#e0bc45' : SHAFT_COLORS[shaft - 1]}
              rx="3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: col * 0.04, type: 'spring', stiffness: 400 }}
            />
          );
        })}

        {/* Thread numbers */}
        {threads.map((_, col) => (
          <text
            key={`num-${col}`}
            x={col * CELL + 28 + CELL / 2 - 1}
            y={shafts * CELL + 22}
            textAnchor="middle"
            fill={col === activeThread ? '#c9a227' : '#4a5568'}
            fontSize="9"
          >
            {col + 1}
          </text>
        ))}
      </svg>
    </div>
  );
}

interface ThreadingDraftReaderProps {
  onComplete: () => void;
}

export function ThreadingDraftReader({ onComplete }: ThreadingDraftReaderProps) {
  const { setChatOpen } = useGameStore();
  const [activePattern, setActivePattern] = useState(0);
  const [activeThread, setActiveThread] = useState(-1);
  const [seenAll, setSeenAll] = useState(new Set<number>([0]));

  const pattern = PATTERNS[activePattern];

  function handlePatternChange(i: number) {
    setActivePattern(i);
    setActiveThread(-1);
    setSeenAll((s) => new Set([...s, i]));
  }

  const canContinue = seenAll.size >= 2;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-loom-cream mb-1">Reading Threading Drafts</h2>
        <p className="text-loom-muted text-sm leading-relaxed">
          A threading draft is a grid that tells you exactly which shaft each warp thread passes through.
          Once you can read one, you can thread any pattern.
        </p>
      </div>

      {/* How to read callout */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: '↕️', label: 'Rows = Shafts', desc: 'Bottom row is Shaft 1, top row is Shaft 4.' },
          { icon: '↔️', label: 'Columns = Threads', desc: 'Each column is one warp thread. Read right → left.' },
          { icon: '■', label: 'Filled = Thread here', desc: 'A filled square means this thread goes through this shaft.' },
        ].map((c) => (
          <div key={c.label} className="bg-loom-raised border border-loom-border rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="text-loom-gold text-xs font-semibold mb-1">{c.label}</div>
            <p className="text-loom-muted text-xs leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Pattern tabs */}
      <div>
        <p className="text-loom-muted text-xs uppercase tracking-wider mb-2">Explore threading patterns</p>
        <div className="flex gap-2 flex-wrap">
          {PATTERNS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handlePatternChange(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 ${
                activePattern === i
                  ? 'border-loom-gold/60 text-loom-cream font-medium'
                  : 'border-loom-border text-loom-muted hover:border-loom-gold/40 hover:text-loom-cream'
              }`}
              style={activePattern === i ? { backgroundColor: `${p.color}18` } : {}}
            >
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
              {p.name}
              {seenAll.has(i) && i !== activePattern && <span className="text-loom-sage text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Draft display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pattern.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-[#0d1525] border border-loom-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-loom-cream font-semibold">{pattern.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-loom-raised text-loom-muted border border-loom-border">
                  {pattern.difficulty}
                </span>
              </div>
              <div className="text-loom-muted text-xs text-right">
                hover a thread →<br />see which shaft
              </div>
            </div>

            {/* The draft grid */}
            <div
              onMouseLeave={() => setActiveThread(-1)}
            >
              {/* Manual hover tracking via thread column buttons */}
              <DraftGrid threads={pattern.threads} activeThread={activeThread} color={pattern.color} />
              <div className="flex mt-1" style={{ paddingLeft: 28 }}>
                {pattern.threads.map((_, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setActiveThread(i)}
                    style={{ width: 28, height: 16, cursor: 'default' }}
                  />
                ))}
              </div>
            </div>

            {/* Active thread callout */}
            <AnimatePresence>
              {activeThread >= 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-loom-border flex items-center gap-2"
                >
                  <span className="text-loom-muted text-xs">Thread {activeThread + 1}:</span>
                  <span
                    className="font-semibold text-sm px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${SHAFT_COLORS[pattern.threads[activeThread] - 1]}25`, color: SHAFT_COLORS[pattern.threads[activeThread] - 1] }}
                  >
                    Shaft {pattern.threads[activeThread]}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pattern info */}
          <div className="bg-loom-raised border border-loom-border rounded-xl p-4 space-y-2">
            <p className="text-loom-cream text-sm leading-relaxed">{pattern.desc}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {pattern.structures.map((s) => (
                <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-loom-card border border-loom-border text-loom-muted">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Wren tip */}
      <div className="bg-loom-raised border border-loom-border rounded-xl p-4 flex gap-3">
        <span className="text-xl flex-shrink-0">🐦</span>
        <p className="text-loom-cream/80 text-sm leading-relaxed italic">
          "I recommend starting with the straight draw. Thread it once and you'll understand every other threading pattern
          because they're all variations on the same idea. The draft is your map — never thread without one."
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button onClick={() => setChatOpen(true)} className="text-loom-muted text-sm hover:text-loom-gold transition-colors flex items-center gap-1.5">
          🐦 <span className="underline underline-offset-2">Ask Wren about drafts</span>
        </button>
        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`btn-gold px-6 py-2.5 rounded-lg font-semibold text-sm ${!canContinue ? 'opacity-50' : ''}`}
          disabled={!canContinue}
        >
          {canContinue ? 'Try threading →' : `Explore ${2 - seenAll.size} more pattern${2 - seenAll.size !== 1 ? 's' : ''} to continue`}
        </motion.button>
      </div>
    </div>
  );
}
