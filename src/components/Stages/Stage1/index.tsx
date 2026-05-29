import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';
import { LoomAnatomy } from './LoomAnatomy';
import { PartsQuiz } from './PartsQuiz';
import { Button } from '../../UI/Button';
import { ProgressRing } from '../../UI/ProgressRing';
import { XPDisplay } from '../../GameLayer/XPDisplay';
import { STAGES } from '../../../data/stages';

type Step = 'intro' | 'anatomy' | 'quiz';

const STEP_ORDER: Step[] = ['intro', 'anatomy', 'quiz'];

function StepIndicator({ current, completed }: { current: Step; completed: Step[] }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'intro', label: 'Introduction' },
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'quiz', label: 'Quiz' },
  ];

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const isDone = completed.includes(step.id);
        const isCurrent = step.id === current;
        return (
          <div key={step.id} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all ${
                isCurrent
                  ? 'bg-loom-gold text-loom-bg font-semibold'
                  : isDone
                  ? 'bg-loom-sage/20 text-loom-sage border border-loom-sage/30'
                  : 'bg-loom-raised text-loom-muted border border-loom-border'
              }`}
            >
              {isDone ? '✓' : i + 1}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-4 h-0.5 rounded ${isDone ? 'bg-loom-sage/40' : 'bg-loom-border'}`} />
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl"
    >
      <div>
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-loom-cream mb-2">Meet Your Loom</h2>
        <p className="text-loom-muted text-base leading-relaxed">
          Before you weave a single thread, you need to know what you're working with.
          Your 4-shaft table loom is a beautifully engineered tool, and every part has a specific job.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: '🏗️', title: 'The Structure', desc: 'The castle, beams and frame give the loom its shape and provide anchor points for warp and cloth.' },
          { icon: '🪡', title: 'The Shedding System', desc: '4 shafts, each holding heddles, control which warp threads rise — creating different shed openings.' },
          { icon: '🎯', title: 'The Reed & Beater', desc: 'The reed spaces your warp evenly; the beater packs each weft thread into place as you weave.' },
          { icon: '🚀', title: 'The Shuttle', desc: 'This smooth wooden tool carries your weft yarn across the shed — back and forth, pick after pick.' },
        ].map((card) => (
          <div key={card.title} className="bg-loom-raised border border-loom-border rounded-xl p-4">
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-loom-cream font-semibold text-sm mb-1">{card.title}</div>
            <p className="text-loom-muted text-xs leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-loom-gold/10 border border-loom-gold/25 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-2xl">🐦</span>
          <div>
            <p className="text-loom-cream text-sm font-semibold mb-0.5">A note from Wren</p>
            <p className="text-loom-cream/80 text-sm leading-relaxed italic">
              "Don't worry about memorising everything right now — that's what the rest of this course is for!
              Just get a feel for the landscape. By the time you've woven your first metre of cloth,
              all these parts will feel like old friends."
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => setChatOpen(true)}
          className="text-loom-muted text-sm hover:text-loom-gold transition-colors flex items-center gap-1.5"
        >
          🐦 <span className="underline underline-offset-2">Chat with Wren</span>
        </button>
        <Button onClick={onComplete} size="lg">
          Explore the Loom →
        </Button>
      </div>
    </motion.div>
  );
}

export function Stage1() {
  const {
    stageProgress,
    completeStep,
    completeStage,
    skipStage,
    goToMap,
    addBadge,
  } = useGameStore();

  const progress = stageProgress[1];
  const completedSteps = (progress?.completedSteps ?? []) as Step[];

  const currentStep: Step = (() => {
    if (!completedSteps.includes('intro')) return 'intro';
    if (!completedSteps.includes('anatomy')) return 'anatomy';
    return 'quiz';
  })();

  const [displayStep, setDisplayStep] = useState<Step>(currentStep);

  function handleIntroComplete() {
    completeStep(1, 'intro');
    addBadge('first-steps');
    setDisplayStep('anatomy');
  }

  function handleAnatomyComplete() {
    completeStep(1, 'anatomy');
    setDisplayStep('quiz');
  }

  function handleQuizComplete(score: number) {
    completeStep(1, 'quiz');
    completeStage(1);
  }

  function handleQuizRetry() {
    setDisplayStep('anatomy');
  }

  const stage = STAGES[0];
  const stepProgress = (completedSteps.length / stage.steps.length) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToMap}
            className="flex items-center gap-2 text-loom-muted hover:text-loom-cream transition-colors text-sm"
          >
            ← Stage Map
          </button>
          <button
            onClick={() => { skipStage(1); goToMap(); }}
            className="text-loom-muted/40 hover:text-loom-muted transition-colors text-xs underline underline-offset-2"
          >
            Skip stage
          </button>
        </div>

        <div className="flex items-center gap-3">
          <ProgressRing progress={stepProgress} size={32} strokeWidth={3}>
            <span className="text-[8px] text-loom-gold font-bold">{Math.round(stepProgress)}%</span>
          </ProgressRing>
          <StepIndicator current={displayStep} completed={completedSteps} />
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="card-base p-6">
            <AnimatePresence mode="wait">
              {displayStep === 'intro' && (
                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <IntroStep onComplete={handleIntroComplete} />
                </motion.div>
              )}
              {displayStep === 'anatomy' && (
                <motion.div key="anatomy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <LoomAnatomy onComplete={handleAnatomyComplete} />
                </motion.div>
              )}
              {displayStep === 'quiz' && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PartsQuiz onComplete={handleQuizComplete} onRetry={handleQuizRetry} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-4 hidden lg:block">
          <XPDisplay />

          {/* Stage info */}
          <div className="card-base p-4">
            <h3 className="text-loom-muted text-xs font-semibold uppercase tracking-wider mb-3">
              Stage 1 Steps
            </h3>
            <div className="space-y-2">
              {[
                { id: 'intro', label: 'Introduction', xp: 25 },
                { id: 'anatomy', label: 'Loom Anatomy', xp: 25 },
                { id: 'quiz', label: 'Parts Quiz', xp: '80' },
              ].map((step) => {
                const done = completedSteps.includes(step.id as Step);
                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between text-xs ${
                      done ? 'text-loom-sage' : displayStep === step.id ? 'text-loom-cream' : 'text-loom-muted'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {done ? '✓' : displayStep === step.id ? '▶' : '○'}
                      {step.label}
                    </span>
                    <span className="text-loom-gold/70">+{step.xp} XP</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-loom-border text-xs text-loom-muted flex justify-between">
              <span>Stage completion</span>
              <span className="text-loom-gold">+100 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
