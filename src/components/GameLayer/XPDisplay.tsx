import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, selectEarnedBadges } from '../../store/gameStore';
import { ProgressRing } from '../UI/ProgressRing';

export function XPDisplay() {
  const { xp, level, streak, completedStages } = useGameStore();
  const earnedBadges = useGameStore(selectEarnedBadges);

  const xpThisLevel = xp - (level - 1) * 150;
  const progressPct = Math.min(100, (xpThisLevel / 150) * 100);

  return (
    <div className="card-base p-4 space-y-4">
      <h3 className="text-loom-muted text-xs font-semibold uppercase tracking-wider">Your Progress</h3>

      {/* Level + XP */}
      <div className="flex items-center gap-4">
        <ProgressRing progress={progressPct} size={60} strokeWidth={5}>
          <span className="text-loom-gold font-bold text-sm">{level}</span>
        </ProgressRing>
        <div>
          <div className="text-loom-cream font-semibold">Level {level}</div>
          <div className="text-loom-muted text-xs">{xp} XP total</div>
          <div className="text-loom-muted text-xs">{level * 150 - xp} XP to Level {level + 1}</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-loom-raised rounded-lg p-2 text-center">
          <div className="text-loom-gold font-bold text-lg">{completedStages.length}</div>
          <div className="text-loom-muted text-[10px]">Stages</div>
        </div>
        <div className="bg-loom-raised rounded-lg p-2 text-center">
          <div className="text-loom-gold font-bold text-lg">{earnedBadges.length}</div>
          <div className="text-loom-muted text-[10px]">Badges</div>
        </div>
        <div className="bg-loom-raised rounded-lg p-2 text-center">
          <div className="text-loom-gold font-bold text-lg">
            {streak.current > 0 ? `🔥${streak.current}` : '—'}
          </div>
          <div className="text-loom-muted text-[10px]">Streak</div>
        </div>
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <div className="text-loom-muted text-[10px] uppercase tracking-wider mb-2">Badges Earned</div>
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence>
              {earnedBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-loom-raised border border-loom-border rounded-full px-2 py-0.5 text-xs flex items-center gap-1 cursor-default"
                  title={badge.description}
                >
                  <span>{badge.icon}</span>
                  <span className="text-loom-muted text-[10px]">{badge.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
