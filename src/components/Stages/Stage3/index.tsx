import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';
import { ThreadingDraftReader } from './ThreadingDraftReader';
import { ThreadingSimulator } from './ThreadingSimulator';
import { ThreadingQuiz } from './ThreadingQuiz';
import { Button } from '../../UI/Button';
import { ProgressRing } from '../../UI/ProgressRing';
import { XPDisplay } from '../../GameLayer/XPDisplay';
import { STAGES } from '../../../data/stages';

type Step = 'intro' | 'draft-reader' | 'threading-sim' | 'quiz';
const STEP_ORDER: Step[] = ['intro', 'draft-reader', 'threading-sim', 'quiz'];

function StepIndicator({ current, completed }: { current: Step; completed: Step[] }) {
  const steps: { id: Step; short: string }[] = [
    { id: 'intro', short: 'Intro' },
    { id: 'draft-reader', short: 'Drafts' },
    { id: 'threading-sim', short: 'Sim' },
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
        <div className="text-5xl mb-4">🪡</div>
        <h2 className="text-2xl font-bold text-loom-cream mb-2">Thread the Heddles</h2>
        <p className="text-loom-muted text-base leading-relaxed">
          Threading is where your weave structure comes to life. Every warp thread passes through one heddle eye
          on one specific shaft — and which shaft determines every pattern you'll ever weave on this warp.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: '📊', title: 'Read the draft', desc: 'Threading drafts are simple grids. One column = one thread, one row = one shaft. A square means "thread goes here."' },
          { icon: '🪝', title: 'Use the threading hook', desc: 'A small metal hook slips through the heddle eye from front to back, grabs the thread, and pulls it through cleanly.' },
          { icon: '➡️⬅️', title: 'Right to left', desc: 'Always thread from right to left — right selvedge first. This matches how the threading draft is read and keeps the thread order correct.' },
          { icon: '🔍', title: 'Check before you sley', desc: 'Once all threads are through, lift each shaft in turn to verify. Fix errors now — before the reed goes on.' },
        ].map((c) => (
          <div key={c.title} className="bg-loom-raised border border-loom-border rounded-xl p-4">
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="text-loom-cream font-semibold text-sm mb-1">{c.title}</div>
            <p className="text-loom-muted text-xs leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Threading checklist */}
      <div className="bg-loom-raised border border-loom-border rounded-xl p-4">
        <p className="text-loom-gold text-xs font-semibold uppercase tracking-wider mb-2">Before you start threading</p>
        <div className="space-y-1.5">
          {[
            'Warp is fully beamed and tensioned on the back beam',
            'You have a threading draft printed or on screen beside you',
            'Heddles are spread evenly across each shaft (roughly ends ÷ 4 per shaft)',
            'Threading hook is within reach',
            'Good lighting — threading in the dark is miserable',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-xs text-loom-muted">
              <span className="text-loom-sage mt-0.5 flex-shrink-0">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-loom-gold/10 border border-loom-gold/25 rounded-xl p-4 flex gap-3">
        <span className="text-2xl">🐦</span>
        <div>
          <p className="text-loom-cream text-sm font-semibold mb-0.5">Wren says</p>
          <p className="text-loom-cream/80 text-sm leading-relaxed italic">
            "Threading is meditative once you get into the rhythm. I like to say the shaft number out loud as I thread each one:
            'One... two... three... four... one...' It sounds silly but it's the best way to catch yourself
            before you make an error."
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button onClick={() => setChatOpen(true)} className="text-loom-muted text-sm hover:text-loom-gold transition-colors flex items-center gap-1.5">
          🐦 <span className="underline underline-offset-2">Chat with Wren</span>
        </button>
        <Button onClick={onComplete} size="lg">Learn to read drafts →</Button>
      </div>
    </motion.div>
  );
}

export function Stage3() {
  const { stageProgress, completeStep, completeStage, goToMap } = useGameStore();

  const progress = stageProgress[3];
  const completedSteps = (progress?.completedSteps ?? []) as Step[];

  const currentStep: Step = (() => {
    for (const s of STEP_ORDER) {
      if (!completedSteps.includes(s)) return s;
    }
    return 'quiz';
  })();

  const [displayStep, setDisplayStep] = useState<Step>(currentStep);

  function advance(step: Step, next: Step) {
    completeStep(3, step);
    setDisplayStep(next);
  }

  function handleQuizComplete(score: number) {
    completeStep(3, 'quiz');
    completeStage(3);
  }

  const stage = STAGES[2];
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
                  <IntroStep onComplete={() => advance('intro', 'draft-reader')} />
                </motion.div>
              )}
              {displayStep === 'draft-reader' && (
                <motion.div key="draft-reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ThreadingDraftReader onComplete={() => advance('draft-reader', 'threading-sim')} />
                </motion.div>
              )}
              {displayStep === 'threading-sim' && (
                <motion.div key="threading-sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ThreadingSimulator onComplete={() => advance('threading-sim', 'quiz')} />
                </motion.div>
              )}
              {displayStep === 'quiz' && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ThreadingQuiz onComplete={handleQuizComplete} onRetry={() => setDisplayStep('draft-reader')} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-64 flex-shrink-0 space-y-4 hidden lg:block">
          <XPDisplay />
          <div className="card-base p-4">
            <h3 className="text-loom-muted text-xs font-semibold uppercase tracking-wider mb-3">Stage 3 Steps</h3>
            <div className="space-y-2">
              {[
                { id: 'intro', label: 'Introduction', xp: 25 },
                { id: 'draft-reader', label: 'Reading Drafts', xp: 25 },
                { id: 'threading-sim', label: 'Thread the Sim', xp: 60 },
                { id: 'quiz', label: 'Threading Quiz', xp: 80 },
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
              <span className="text-loom-gold">+150 XP</span>
            </div>
          </div>

          {/* Pattern cheat-sheet */}
          <div className="card-base p-4">
            <h3 className="text-loom-muted text-xs font-semibold uppercase tracking-wider mb-3">Threading patterns</h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Straight draw', seq: '1–2–3–4', color: '#c9a227' },
                { name: 'Point twill', seq: '1–2–3–4–3–2', color: '#8b3a2a' },
                { name: 'Rosepath', seq: '1–2–3–2–1–4', color: '#4e8a5e' },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between gap-2">
                  <span className="text-loom-muted">{p.name}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-loom-raised border border-loom-border"
                    style={{ color: p.color }}>
                    {p.seq}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
