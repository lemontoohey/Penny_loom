import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';

interface WarpChainAndBeamProps {
  onComplete: () => void;
}

const CHAIN_STEPS = [
  {
    icon: '1️⃣',
    title: 'Secure the cross first',
    desc: 'Before touching anything else, thread a contrasting yarn through the cross in a figure-8, and tie it loosely. Do this twice — one tie right at the cross, one 5 cm further back. The cross is your thread order — protect it with your life.',
    warning: true,
  },
  {
    icon: '2️⃣',
    title: 'Tie the chain end',
    desc: 'Move to the far peg end (opposite the cross). Make a loose tie around the whole warp here too, so threads don\'t splay out.',
  },
  {
    icon: '3️⃣',
    title: 'Start chaining from the far end',
    desc: 'Slip the warp off the far peg. Put your hand through the loop, grab the warp behind your wrist, and pull a new loop through. This is exactly like making a crochet chain with your arm.',
  },
  {
    icon: '4️⃣',
    title: 'Chain toward the cross',
    desc: 'Keep chaining — grab, pull through — moving steadily toward the cross end. Keep the loops loose and even. If you chain too tightly the warp will tangle when you unchain it at the loom.',
  },
  {
    icon: '5️⃣',
    title: 'Stop before the cross',
    desc: 'Stop chaining about 30 cm before the cross end. Slip the last loop over the whole chain to lock it. The cross should now dangle free at the end — ready for threading.',
  },
];

const BEAM_STEPS = [
  {
    icon: '🔀',
    title: 'Spread through the raddle or back of reed',
    desc: 'Lay the warp chain over the back beam. Use a raddle (if you have one) or thread through the back of the reed to spread the warp to its full width evenly.',
  },
  {
    icon: '⚓',
    title: 'Tie onto the warp beam apron rod',
    desc: 'Take sections of warp from the front (cross end) and loop them over the apron rod. Tie with a lark\'s head knot. Make sure sections are evenly spaced across the full width.',
  },
  {
    icon: '🤝',
    title: 'Wind on with a helper (or weights)',
    desc: 'Have a helper hold the chain taut from the front while you crank the warp beam. No helper? Drape the chain over the breast beam and hang a water bottle from it as a tensioning weight.',
  },
  {
    icon: '📄',
    title: 'Insert packing between layers',
    desc: 'Every full revolution of the beam, lay in a strip of packing paper or cardboard sticks. This stops threads from a previous layer pressing into the next, which would cause uneven tension.',
  },
  {
    icon: '✅',
    title: 'Wind until 30 cm of warp remains',
    desc: 'Stop when you have about 30 cm of warp in front of the reed — enough to thread through the heddles and tie on at the front. The warp is now beamed and ready to thread!',
  },
];

function StepCard({ icon, title, desc, warning = false, index }: {
  icon: string; title: string; desc: string; warning?: boolean; index: number;
}) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        warning ? 'border-loom-rust/40 bg-loom-rust/10' : 'border-loom-border bg-loom-raised'
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-lg flex-shrink-0">{icon}</span>
        <span className="text-loom-cream text-sm font-medium flex-1">{title}</span>
        <span className="text-loom-muted text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 pl-11">
          <p className={`text-sm leading-relaxed ${warning ? 'text-white' : 'text-loom-cream/85'}`}>{desc}</p>
        </div>
      )}
    </motion.div>
  );
}

export function WarpChainAndBeam({ onComplete }: WarpChainAndBeamProps) {
  const { setChatOpen } = useGameStore();
  const [tab, setTab] = useState<'chain' | 'beam'>('chain');
  const [chainRead, setChainRead] = useState(false);
  const [beamRead, setBeamRead] = useState(false);

  const canComplete = chainRead && beamRead;

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-loom-cream mb-1">Chain & Beam the Warp</h2>
        <p className="text-loom-muted text-sm leading-relaxed">
          Two final steps before you can thread: get the warp off the board safely (chaining) and wind it onto the loom (beaming).
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 p-1 bg-loom-raised rounded-xl">
        {[
          { id: 'chain' as const, label: '🔗 Chaining off the board', done: chainRead },
          { id: 'beam' as const, label: '🎡 Beaming onto the loom', done: beamRead },
        ].map(({ id, label, done }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${
              tab === id
                ? 'bg-loom-card border border-loom-gold/40 text-loom-cream shadow-sm'
                : 'text-loom-muted hover:text-loom-cream'
            }`}
          >
            {label}
            {done && <span className="text-loom-sage text-[10px]">✓</span>}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {tab === 'chain'
          ? CHAIN_STEPS.map((s, i) => (
              <StepCard key={s.title} {...s} index={i} />
            ))
          : BEAM_STEPS.map((s, i) => (
              <StepCard key={s.title} {...s} index={i} />
            ))}
      </div>

      {/* Wren tip */}
      <div className="bg-loom-raised border border-loom-border rounded-xl p-4 flex gap-3">
        <span className="text-xl flex-shrink-0">🐦</span>
        <p className="text-loom-cream/80 text-sm leading-relaxed italic">
          {tab === 'chain'
            ? '"The chain is just like chaining yarn in crochet. Loose and even is the goal. If you feel resistance, stop and check — a thread has probably slipped out of the cross."'
            : '"Beaming tension is everything. If your warp goes on saggy, it will never weave well. I like to say: firm enough that you can play a G on it, not tight enough to snap."'}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setChatOpen(true)}
          className="text-loom-muted text-xs hover:text-loom-gold transition-colors"
        >
          🐦 Ask Wren
        </button>

        <div className="flex gap-2">
          {tab === 'chain' ? (
            <motion.button
              onClick={() => { setChainRead(true); setTab('beam'); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`btn-gold px-5 py-2 rounded-lg text-sm font-semibold ${chainRead ? 'opacity-60' : ''}`}
            >
              {chainRead ? '✓ Done' : 'Got it → Beaming'}
            </motion.button>
          ) : (
            <motion.button
              onClick={() => {
                setBeamRead(true);
                setTimeout(onComplete, 400);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              {beamRead ? '✓ Complete!' : 'Warp is beamed →'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
