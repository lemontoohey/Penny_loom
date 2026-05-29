import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGE2_QUIZ } from '../../../data/stage2Quiz';
import { useGameStore } from '../../../store/gameStore';
import { Button } from '../../UI/Button';
import { ProgressRing } from '../../UI/ProgressRing';

const PASS_THRESHOLD = 6;

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export function WarpQuiz({ onComplete, onRetry }: { onComplete: (score: number) => void; onRetry: () => void }) {
  const { addXP, setChatOpen, setQuizScore, addBadge } = useGameStore();

  const total = STAGE2_QUIZ.length;
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selected: number; state: AnswerState }>>({});
  const [showExp, setShowExp] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentQ = STAGE2_QUIZ[qIndex];
  const currentAns = answers[currentQ?.id];
  const score = Object.values(answers).filter((a) => a.state === 'correct').length;

  function pick(i: number) {
    if (currentAns || advancing) return;
    const correct = i === currentQ.correct;
    if (correct) addXP(10, `Stage 2 quiz: ${currentQ.id}`);
    setAnswers((prev) => ({ ...prev, [currentQ.id]: { selected: i, state: correct ? 'correct' : 'incorrect' } }));
    setShowExp(true);
  }

  function next() {
    setShowExp(false);
    setAdvancing(true);
    setTimeout(() => {
      setAdvancing(false);
      if (qIndex < total - 1) {
        setQIndex((q) => q + 1);
      } else {
        setAnswers((prev) => {
          const finalScore = Object.values(prev).filter((a) => a.state === 'correct').length;
          setQuizScore(2, finalScore);
          if (finalScore >= PASS_THRESHOLD) addBadge('first-warp');
          setFinished(true);
          return prev;
        });
      }
    }, 280);
  }

  if (finished) {
    const passed = score >= PASS_THRESHOLD;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
        <div className="py-4">
          <div className="text-6xl mb-4">{passed ? '🧵' : '📚'}</div>
          <h2 className="text-2xl font-bold text-loom-cream mb-1">{passed ? 'Warp wizard!' : 'Almost!'}</h2>
          <p className="text-loom-muted text-sm mb-6">
            {score}/{total} correct · {passed ? 'Stage 2 complete!' : `Need ${PASS_THRESHOLD} to pass`}
          </p>

          <div className="flex justify-center mb-6">
            <ProgressRing progress={(score / total) * 100} size={96} strokeWidth={8} color={passed ? '#c9a227' : '#6a6a5a'}>
              <div className="text-loom-gold font-bold text-xl">{score}/{total}</div>
            </ProgressRing>
          </div>

          {passed && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-loom-gold/20 border border-loom-gold/30 rounded-full px-4 py-2 mb-4"
            >
              <span>🧵</span>
              <span className="text-loom-gold text-sm font-semibold">First Warp badge earned!</span>
            </motion.div>
          )}

          <div className="text-left space-y-1.5 mb-6">
            {STAGE2_QUIZ.map((q) => {
              const a = answers[q.id];
              const ok = a?.state === 'correct';
              return (
                <div key={q.id} className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${ok ? 'bg-loom-sage/10 text-loom-sage' : 'bg-red-900/20 text-red-300'}`}>
                  <span>{ok ? '✓' : '✗'}</span>
                  <span className="flex-1 truncate">{q.question}</span>
                  <span className="text-[10px] opacity-70">{ok ? '+10 XP' : q.options[q.correct].slice(0, 20)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            {!passed && <Button onClick={onRetry} variant="ghost" fullWidth>Try Again</Button>}
            {passed
              ? <Button onClick={() => onComplete(score)} fullWidth size="lg">Complete Stage 2 →</Button>
              : <Button onClick={() => setChatOpen(true)} variant="sage" fullWidth>Ask Wren for Help</Button>}
          </div>
        </div>
      </motion.div>
    );
  }

  const pct = (qIndex / total) * 100;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-loom-cream">Warping Quiz</h2>
          <p className="text-loom-muted text-sm">Question {qIndex + 1} of {total} · Need {PASS_THRESHOLD}/{total}</p>
        </div>
        <ProgressRing progress={pct} size={44} strokeWidth={4}>
          <span className="text-loom-gold text-[10px] font-bold">{qIndex}/{total}</span>
        </ProgressRing>
      </div>

      <div className="h-1.5 bg-loom-raised rounded-full overflow-hidden">
        <motion.div className="h-full bg-loom-gold rounded-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait">
        {!advancing && (
          <motion.div key={currentQ.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }} className="space-y-4">
            <div className="bg-loom-raised border border-loom-border rounded-xl p-4">
              <p className="text-loom-cream font-medium text-base leading-relaxed">{currentQ.question}</p>
            </div>

            <div className="grid gap-2">
              {currentQ.options.map((opt, i) => {
                const sel = currentAns?.selected === i;
                const correct = i === currentQ.correct;
                const answered = !!currentAns;
                let cls = 'bg-loom-raised border-loom-border text-loom-cream hover:border-loom-gold/50';
                if (answered) {
                  if (correct) cls = 'bg-loom-sage/20 border-loom-sage text-loom-cream';
                  else if (sel) cls = 'bg-red-900/30 border-red-500/60 text-loom-cream';
                  else cls = 'bg-loom-raised border-loom-border text-loom-muted opacity-50';
                }
                return (
                  <motion.button key={i} onClick={() => pick(i)} disabled={answered}
                    whileHover={!answered ? { scale: 1.01, x: 4 } : {}}
                    className={`text-left px-4 py-3 rounded-xl border transition-all text-sm flex items-center gap-3 ${cls}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      answered && correct ? 'bg-loom-sage text-white' : answered && sel ? 'bg-red-600 text-white' : 'bg-loom-border text-loom-muted'
                    }`}>
                      {answered && correct ? '✓' : answered && sel ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExp && currentAns && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className={`rounded-xl p-4 border ${currentAns.state === 'correct' ? 'bg-loom-sage/10 border-loom-sage/30' : 'bg-red-900/20 border-red-500/30'}`}
                >
                  <div className="flex gap-2 items-start">
                    <span className="text-base flex-shrink-0">{currentAns.state === 'correct' ? '✅' : '💡'}</span>
                    <div>
                      <p className="text-loom-cream text-sm leading-relaxed">{currentQ.explanation}</p>
                      {currentAns.state === 'correct' && <p className="text-loom-gold text-xs font-semibold mt-1">+10 XP earned!</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {currentAns && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
                <button onClick={() => setChatOpen(true)} className="text-loom-muted text-xs hover:text-loom-gold transition-colors">🐦 Ask Wren</button>
                <Button onClick={next}>{qIndex < total - 1 ? 'Next →' : 'See Results →'}</Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
