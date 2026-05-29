import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';
import { WarpPlanner } from './WarpPlanner';
import { WarpingBoardGuide } from './WarpingBoardGuide';
import { WarpChainAndBeam } from './WarpChainAndBeam';
import { WarpQuiz } from './WarpQuiz';
import { Button } from '../../UI/Button';
import { ProgressRing } from '../../UI/ProgressRing';
import { XPDisplay } from '../../GameLayer/XPDisplay';
import { STAGES } from '../../../data/stages';

type Step = 'intro' | 'planning' | 'warping-board' | 'chain' | 'quiz';
const STEP_ORDER: Step[] = ['intro', 'planning', 'warping-board', 'chain', 'quiz'];

function StepIndicator({ current, completed }: { current: Step; completed: Step[] }) {
  const steps: { id: Step; short: string }[] = [
    { id: 'intro', short: 'Intro' },
    { id: 'planning', short: 'Plan' },
    { id: 'warping-board', short: 'Board' },
    { id: 'chain', short: 'Chain' },
    { id: 'quiz', short: 'Quiz' },
  ];
  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => {
        const done = completed.includes(s.id);
        const active = s.id === current;
        return (
          <div key={s.id} className="flex items-center gap-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all ${
              active ? 'bg-loom-gold text-loom-bg font-semibold' :
              done ? 'bg-loom-sage/20 text-loom-sage border border-loom-sage/30' :
              'bg-loom-raised text-loom-muted border border-loom-border'
            }`}>
              {done ? '✓' : i + 1}
              <span className="hidden sm:inline">{s.short}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-3 h-0.5 rounded ${done ? 'bg-loom-sage/40' : 'bg-loom-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function IntroStep({ onComplete }: { onComplete: () => void }) {
  const { setChatOpen } = useGameStore();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <div className="text-5xl mb-4">🧵</div>
        <h2 className="text-2xl font-bold text-loom-cream mb-2">Wind Your First Warp</h2>
        <p className="text-loom-muted text-base leading-relaxed">
          The warp is the backbone of your cloth. Every decision you make now — how many threads, how long, how tight —
          shapes everything that follows. Good warping takes patience, but it's deeply satisfying once you get it.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: '📐', title: 'Plan first', desc: 'Calculate exactly how many threads you need and how long to make them — before touching the yarn.' },
          { icon: '🔄', title: 'The figure-8 cross', desc: 'The cross keeps every thread in order and is the secret to easy threading later. You\'ll learn to wind it on the warping board.' },
          { icon: '⛓️', title: 'Chain it safely', desc: 'Once wound, the warp is chained off the board like a giant crochet chain — keeping it tangle-free for the loom.' },
          { icon: '🎡', title: 'Beam it on', desc: 'The warp is wound onto the back beam under tension, with packing between layers, ready for threading.' },
        ].map((c) => (
          <div key={c.title} className="bg-loom-raised border border-loom-border rounded-xl p-4">
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="text-loom-cream font-semibold text-sm mb-1">{c.title}</div>
            <p className="text-loom-muted text-xs leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-loom-gold/10 border border-loom-gold/25 rounded-xl p-4 flex gap-3">
        <span className="text-2xl">🐦</span>
        <div>
          <p className="text-loom-cream text-sm font-semibold mb-0.5">Wren says</p>
          <p className="text-loom-cream/80 text-sm leading-relaxed italic">
            "Warping is where most beginners run into trouble — usually because they skipped the planning.
            Do the calculator step properly, and you'll avoid 90% of warping headaches. I promise."
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button onClick={() => setChatOpen(true)} className="text-loom-muted text-sm hover:text-loom-gold transition-colors flex items-center gap-1.5">
          🐦 <span className="underline underline-offset-2">Chat with Wren</span>
        </button>
        <Button onClick={onComplete} size="lg">Start planning →</Button>
      </div>
    </motion.div>
  );
}

export function Stage2() {
  const { stageProgress, completeStep, completeStage, goToMap } = useGameStore();

  const progress = stageProgress[2];
  const completedSteps = (progress?.completedSteps ?? []) as Step[];

  const currentStep: Step = (() => {
    for (const s of STEP_ORDER) {
      if (!completedSteps.includes(s)) return s;
    }
    return 'quiz';
  })();

  const [displayStep, setDisplayStep] = useState<Step>(currentStep);

  function advance(step: Step, next: Step) {
    completeStep(2, step);
    setDisplayStep(next);
  }

  function handleQuizComplete(score: number) {
    completeStep(2, 'quiz');
    completeStage(2);
  }

  const stage = STAGES[1]; // Stage 2
  const stepPct = (completedSteps.length / stage.steps.length) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToMap} className="flex items-center gap-2 text-loom-muted hover:text-loom-cream transition-colors text-sm">
          ← Stage Map
        </button>
        <div className="flex items-center gap-3">
          <ProgressRing progress={stepPct} size={32} strokeWidth={3}>
            <span className="text-[8px] text-loom-gold font-bold">{Math.round(stepPct)}%</span>
          </ProgressRing>
          <StepIndicator current={displayStep} completed={completedSteps} />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="card-base p-6">
            <AnimatePresence mode="wait">
              {displayStep === 'intro' && (
                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <IntroStep onComplete={() => advance('intro', 'planning')} />
                </motion.div>
              )}
              {displayStep === 'planning' && (
                <motion.div key="planning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <WarpPlanner onComplete={() => advance('planning', 'warping-board')} />
                </motion.div>
              )}
              {displayStep === 'warping-board' && (
                <motion.div key="warping-board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <WarpingBoardGuide onComplete={() => advance('warping-board', 'chain')} />
                </motion.div>
              )}
              {displayStep === 'chain' && (
                <motion.div key="chain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <WarpChainAndBeam onComplete={() => advance('chain', 'quiz')} />
                </motion.div>
              )}
              {displayStep === 'quiz' && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <WarpQuiz onComplete={handleQuizComplete} onRetry={() => setDisplayStep('planning')} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-64 flex-shrink-0 space-y-4 hidden lg:block">
          <XPDisplay />
          <div className="card-base p-4">
            <h3 className="text-loom-muted text-xs font-semibold uppercase tracking-wider mb-3">Stage 2 Steps</h3>
            <div className="space-y-2">
              {[
                { id: 'intro', label: 'Introduction', xp: 25 },
                { id: 'planning', label: 'Warp Planner', xp: 25 },
                { id: 'warping-board', label: 'Warping Board', xp: 25 },
                { id: 'chain', label: 'Chain & Beam', xp: 25 },
                { id: 'quiz', label: 'Warping Quiz', xp: 80 },
              ].map((s) => {
                const done = completedSteps.includes(s.id as Step);
                return (
                  <div key={s.id} className={`flex items-center justify-between text-xs ${done ? 'text-loom-sage' : displayStep === s.id ? 'text-loom-cream' : 'text-loom-muted'}`}>
                    <span className="flex items-center gap-1.5">
                      {done ? '✓' : displayStep === s.id ? '▶' : '○'} {s.label}
                    </span>
                    <span className="text-loom-gold/70">+{s.xp} XP</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-loom-border text-xs text-loom-muted flex justify-between">
              <span>Stage completion</span>
              <span className="text-loom-gold">+125 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
