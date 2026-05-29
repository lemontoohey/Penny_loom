import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { ProgressRing } from '../UI/ProgressRing';
import { useState, useEffect } from 'react';

export function Header() {
  const {
    xp, level, streak, earnedBadgeIds, activeView, activeStage,
    recentXPGains, goToMap, setShowApiKeyModal,
    aiProvider,
  } = useGameStore();

  const [showXPPop, setShowXPPop] = useState(false);
  const [lastGain, setLastGain] = useState<{ amount: number; reason: string } | null>(null);

  const xpToNextLevel = level * 150;
  const xpThisLevel = xp - (level - 1) * 150;
  const progressPct = Math.min(100, (xpThisLevel / 150) * 100);

  useEffect(() => {
    if (recentXPGains.length > 0) {
      const latest = recentXPGains[0];
      if (Date.now() - latest.timestamp < 500) {
        setLastGain(latest);
        setShowXPPop(true);
        setTimeout(() => setShowXPPop(false), 2000);
      }
    }
  }, [recentXPGains]);

  return (
    <header className="sticky top-0 z-40 bg-loom-bg/95 backdrop-blur-sm border-b border-loom-border bg-weave">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo + nav */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToMap}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl">🧶</span>
            <span className="text-loom-cream font-semibold text-sm hidden sm:block">
              Loom Studio Buddy
            </span>
          </button>

          {activeView === 'stage' && (
            <>
              <span className="text-loom-border">/</span>
              <span className="text-loom-gold text-sm font-medium">
                Stage {activeStage}
              </span>
            </>
          )}
        </div>

        {/* Right side: XP + streak + badges */}
        <div className="flex items-center gap-3">
          {/* AI provider pill */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="hidden sm:flex items-center gap-1.5 bg-loom-raised border border-loom-border hover:border-loom-gold/50 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
            title="Switch AI provider"
          >
            <span className="text-xs">{aiProvider === 'groq' ? '⚡' : '🤖'}</span>
            <span className="text-loom-muted text-[10px] font-medium uppercase tracking-wide">
              {aiProvider === 'groq' ? 'Groq' : 'Claude'}
            </span>
          </button>

          {/* Streak */}
          {streak.current > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-loom-raised border border-loom-border rounded-full px-3 py-1">
              <span className="text-sm">🔥</span>
              <span className="text-loom-cream text-xs font-semibold">{streak.current}</span>
            </div>
          )}

          {/* Badges earned count */}
          {earnedBadgeIds.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-loom-raised border border-loom-border rounded-full px-3 py-1">
              <span className="text-sm">🏅</span>
              <span className="text-loom-cream text-xs font-semibold">{earnedBadgeIds.length}</span>
            </div>
          )}

          {/* XP progress ring */}
          <div className="relative flex items-center gap-2">
            <AnimatePresence>
              {showXPPop && lastGain && (
                <motion.div
                  initial={{ opacity: 0, y: 0, x: '-50%' }}
                  animate={{ opacity: 1, y: -28, x: '-50%' }}
                  exit={{ opacity: 0, y: -44, x: '-50%' }}
                  className="absolute left-1/2 top-0 pointer-events-none z-50 whitespace-nowrap"
                >
                  <span className="text-loom-gold font-bold text-sm drop-shadow-lg">
                    +{lastGain.amount} XP
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <ProgressRing progress={progressPct} size={34} strokeWidth={3}>
              <span className="text-loom-gold text-[9px] font-bold">{level}</span>
            </ProgressRing>

            <div className="text-right hidden sm:block">
              <div className="text-loom-cream text-xs font-semibold">{xp} XP</div>
              <div className="text-loom-muted text-[10px]">Lv. {level} · {xpToNextLevel - xp} to next</div>
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="text-loom-muted hover:text-loom-cream transition-colors text-lg"
            title="API Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
