import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { STAGES } from '../../data/stages';
import { ALL_BADGES } from '../../data/badges';
import { Button } from '../UI/Button';
import { useEffect, useRef } from 'react';

function Confetti() {
  const colors = ['#c9a227', '#e0bc45', '#f5f0e8', '#8b3a2a', '#4e8a5e'];
  const pieces = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((i) => {
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 1.5 + Math.random() * 1;
        const size = 6 + Math.random() * 8;
        const rotate = Math.random() * 720;

        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${left}vw`, opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', opacity: 0, rotate }}
            transition={{ duration, delay, ease: 'easeIn' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        );
      })}
    </div>
  );
}

export function StageUnlockCelebration() {
  const { pendingCelebration, dismissCelebration } = useGameStore();

  const stage = pendingCelebration
    ? STAGES.find((s) => s.id === pendingCelebration.stageId)
    : null;

  const badge = pendingCelebration?.badgeId
    ? ALL_BADGES.find((b) => b.id === pendingCelebration.badgeId)
    : null;

  const nextStage = stage && stage.id < 9 ? STAGES.find((s) => s.id === stage.id + 1) : null;

  useEffect(() => {
    if (!pendingCelebration) return;
    const timer = setTimeout(dismissCelebration, 8000);
    return () => clearTimeout(timer);
  }, [pendingCelebration, dismissCelebration]);

  return (
    <AnimatePresence>
      {pendingCelebration && stage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={dismissCelebration}
        >
          <Confetti />

          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="relative bg-loom-card border border-loom-gold/40 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 0 40px rgba(201,162,39,0.3)' }}
          >
            {/* Stage icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              className="text-6xl mb-4"
            >
              {stage.icon}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gradient-gold mb-1"
            >
              Stage Complete!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-loom-muted text-sm mb-5"
            >
              You've mastered{' '}
              <span className="text-loom-cream font-medium">{stage.name}</span>
            </motion.p>

            {/* Badge earned */}
            {badge && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-loom-gold/20 border border-loom-gold/40 rounded-full px-4 py-2 mb-5"
              >
                <span className="text-xl">{badge.icon}</span>
                <div className="text-left">
                  <div className="text-loom-gold font-semibold text-sm">{badge.name}</div>
                  <div className="text-loom-muted text-xs">{badge.description}</div>
                </div>
              </motion.div>
            )}

            {/* Next stage teaser */}
            {nextStage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-loom-muted text-xs mb-5"
              >
                Up next:{' '}
                <span className="text-loom-cream">
                  {nextStage.icon} {nextStage.name}
                </span>
              </motion.div>
            )}

            <Button onClick={dismissCelebration} fullWidth>
              Continue →
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
