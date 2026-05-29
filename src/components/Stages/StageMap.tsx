import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { STAGES } from '../../data/stages';
import { ProgressRing } from '../UI/ProgressRing';

interface StageCardProps {
  stageId: number;
  unlocked: boolean;
  completed: boolean;
  isCurrent: boolean;
  progress: number; // 0–100
  onClick: () => void;
}

function StageCard({ stageId, unlocked, completed, isCurrent, progress, onClick }: StageCardProps) {
  const stage = STAGES.find((s) => s.id === stageId)!;
  const locked = !unlocked;

  return (
    <motion.button
      onClick={locked ? undefined : onClick}
      whileHover={locked ? {} : { scale: 1.02, y: -2 }}
      whileTap={locked ? {} : { scale: 0.98 }}
      className={`
        relative text-left p-5 rounded-2xl border transition-all duration-200 w-full
        ${locked
          ? 'bg-loom-card/50 border-loom-border/50 cursor-not-allowed opacity-50'
          : completed
          ? 'bg-loom-card border-loom-sage/40 hover:border-loom-sage cursor-pointer'
          : isCurrent
          ? 'bg-loom-card border-loom-gold/50 cursor-pointer'
          : 'bg-loom-card border-loom-border hover:border-loom-border cursor-pointer'
        }
      `}
      style={
        isCurrent && !locked
          ? { boxShadow: '0 0 20px rgba(201,162,39,0.15)' }
          : undefined
      }
    >
      {/* Stage number */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-xl
              ${locked ? 'bg-loom-raised' : completed ? 'bg-loom-sage/20' : isCurrent ? 'bg-loom-gold/15' : 'bg-loom-raised'}
            `}
          >
            {locked ? '🔒' : completed ? '✅' : stage.icon}
          </div>
          <div>
            <div className="text-loom-muted text-[10px] uppercase tracking-wider">
              Stage {stageId}
            </div>
            <div className={`font-semibold text-sm ${locked ? 'text-loom-muted' : 'text-loom-cream'}`}>
              {stage.shortName}
            </div>
          </div>
        </div>

        {/* Progress ring (only for in-progress) */}
        {!locked && !completed && progress > 0 && (
          <ProgressRing progress={progress} size={32} strokeWidth={3}>
            <span className="text-[8px] text-loom-gold font-bold">{Math.round(progress)}%</span>
          </ProgressRing>
        )}

        {/* XP badge */}
        {!locked && (
          <div className="text-[10px] text-loom-muted bg-loom-raised rounded-full px-2 py-0.5 flex items-center gap-1">
            <span className="text-loom-gold">+{stage.xpReward}</span>
            <span>XP</span>
          </div>
        )}
      </div>

      <p className={`text-xs leading-relaxed ${locked ? 'text-loom-muted/60' : 'text-loom-muted'}`}>
        {locked ? 'Complete previous stage to unlock' : stage.description}
      </p>

      {/* Current indicator */}
      {isCurrent && !completed && (
        <div className="mt-3 flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-loom-gold"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-loom-gold text-[10px] font-medium">In progress</span>
        </div>
      )}

      {/* Completed indicator */}
      {completed && (
        <div className="mt-3 text-loom-sage text-[10px] font-medium">
          ✓ Complete
        </div>
      )}
    </motion.button>
  );
}

export function StageMap() {
  const { unlockedStages, completedStages, stageProgress, goToStage, xp, level, streak } = useGameStore();

  function getStageProgress(stageId: number): number {
    const progress = stageProgress[stageId];
    if (!progress) return 0;
    const stage = STAGES.find((s) => s.id === stageId);
    if (!stage) return 0;
    return (progress.completedSteps.length / stage.steps.length) * 100;
  }

  const currentStageId = (() => {
    for (let i = 1; i <= 9; i++) {
      if (!completedStages.includes(i) && unlockedStages.includes(i)) return i;
    }
    return 9;
  })();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="text-5xl mb-4">🧶</div>
        <h1 className="text-3xl font-bold text-gradient-gold mb-2">
          Loom Studio Buddy
        </h1>
        <p className="text-loom-muted text-base max-w-lg mx-auto">
          Your complete guide to weaving on a 4-shaft table loom — from anatomy to your first finished piece.
        </p>

        {/* Quick stats */}
        <div className="flex justify-center gap-4 mt-6">
          <div className="bg-loom-card border border-loom-border rounded-xl px-4 py-2">
            <span className="text-loom-gold font-bold">{xp}</span>
            <span className="text-loom-muted text-sm ml-1">XP · Lv.{level}</span>
          </div>
          <div className="bg-loom-card border border-loom-border rounded-xl px-4 py-2">
            <span className="text-loom-gold font-bold">{completedStages.length}</span>
            <span className="text-loom-muted text-sm ml-1">/9 stages</span>
          </div>
          {streak.current > 0 && (
            <div className="bg-loom-card border border-loom-border rounded-xl px-4 py-2">
              <span className="text-xl">🔥</span>
              <span className="text-loom-gold font-bold ml-1">{streak.current}</span>
              <span className="text-loom-muted text-sm ml-1">day streak</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stage grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAGES.map((stage, idx) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <StageCard
              stageId={stage.id}
              unlocked={unlockedStages.includes(stage.id)}
              completed={completedStages.includes(stage.id)}
              isCurrent={stage.id === currentStageId}
              progress={getStageProgress(stage.id)}
              onClick={() => goToStage(stage.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-loom-muted/50 text-xs mt-8"
      >
        Click the 🐦 button anytime to ask your AI tutor Wren a question
      </motion.p>
    </div>
  );
}
