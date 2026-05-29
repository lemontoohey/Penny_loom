import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGE1_QUIZ } from '../../../data/quizData';
import { useGameStore } from '../../../store/gameStore';
import { Button } from '../../UI/Button';
import { ProgressRing } from '../../UI/ProgressRing';

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

interface QuizState {
  questionIndex: number;
  answers: Record<string, { selected: number; state: AnswerState }>;
  finished: boolean;
}

interface PartsQuizProps {
  onComplete: (score: number) => void;
  onRetry: () => void;
}

const PASS_THRESHOLD = 6;

export function PartsQuiz({ onComplete, onRetry }: PartsQuizProps) {
  const { addXP, setChatOpen, setQuizScore, addBadge } = useGameStore();

  const [state, setState] = useState<QuizState>({
    questionIndex: 0,
    answers: {},
    finished: false,
  });
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const total = STAGE1_QUIZ.length;
  const currentQ = STAGE1_QUIZ[state.questionIndex];
  const currentAnswer = state.answers[currentQ?.id];
  const progressPct = ((state.questionIndex) / total) * 100;

  const score = Object.values(state.answers).filter((a) => a.state === 'correct').length;

  function handleOptionClick(optionIndex: number) {
    if (currentAnswer || isAdvancing) return;

    const isCorrect = optionIndex === currentQ.correct;
    const newState: AnswerState = isCorrect ? 'correct' : 'incorrect';

    if (isCorrect) {
      addXP(10, `Quiz: "${currentQ.question.slice(0, 30)}..."`);
    }

    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQ.id]: { selected: optionIndex, state: newState },
      },
    }));

    setShowExplanation(true);
  }

  function handleNext() {
    setShowExplanation(false);
    setIsAdvancing(true);

    setTimeout(() => {
      setIsAdvancing(false);
      if (state.questionIndex < total - 1) {
        setState((prev) => ({ ...prev, questionIndex: prev.questionIndex + 1 }));
      } else {
        setState((prev) => {
          const finalScore = Object.values(prev.answers).filter((a) => a.state === 'correct').length;
          setQuizScore(1, finalScore);
          if (finalScore >= PASS_THRESHOLD) addBadge('loom-scholar');
          return { ...prev, finished: true };
        });
      }
    }, 300);
  }

  function handleFinish() {
    onComplete(score);
  }

  if (state.finished) {
    const passed = score >= PASS_THRESHOLD;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center"
      >
        <div className="py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="text-6xl mb-4"
          >
            {passed ? '🎉' : '📚'}
          </motion.div>

          <h2 className="text-2xl font-bold text-loom-cream mb-1">
            {passed ? 'Well done!' : 'Almost there!'}
          </h2>
          <p className="text-loom-muted text-sm mb-6">
            You got{' '}
            <span className={`font-bold text-lg ${passed ? 'text-loom-gold' : 'text-loom-muted'}`}>
              {score}/{total}
            </span>{' '}
            correct · {passed ? 'Quiz passed!' : `Need ${PASS_THRESHOLD} to pass`}
          </p>

          {/* Score ring */}
          <div className="flex justify-center mb-6">
            <ProgressRing progress={(score / total) * 100} size={100} strokeWidth={8} color={passed ? '#c9a227' : '#6a6a5a'}>
              <div className="text-center">
                <div className={`font-bold text-2xl ${passed ? 'text-loom-gold' : 'text-loom-muted'}`}>
                  {score}/{total}
                </div>
              </div>
            </ProgressRing>
          </div>

          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-loom-gold/20 border border-loom-gold/30 rounded-full px-4 py-2 mb-4"
            >
              <span>📚</span>
              <span className="text-loom-gold text-sm font-semibold">Loom Scholar badge earned!</span>
            </motion.div>
          )}

          {/* Question review */}
          <div className="text-left space-y-2 mb-6">
            {STAGE1_QUIZ.map((q, i) => {
              const ans = state.answers[q.id];
              const correct = ans?.state === 'correct';
              return (
                <div
                  key={q.id}
                  className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${
                    correct ? 'bg-loom-sage/10 text-loom-sage' : 'bg-red-900/20 text-red-300'
                  }`}
                >
                  <span>{correct ? '✓' : '✗'}</span>
                  <span className="flex-1 truncate">{q.question}</span>
                  <span className="text-[10px] opacity-70">
                    {correct ? '+10 XP' : `Ans: ${q.options[q.correct]}`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            {!passed && (
              <Button onClick={onRetry} variant="ghost" fullWidth>
                Try Again
              </Button>
            )}
            {passed ? (
              <Button onClick={handleFinish} fullWidth size="lg">
                Complete Stage 1 →
              </Button>
            ) : (
              <Button onClick={() => setChatOpen(true)} variant="sage" fullWidth>
                Ask Wren for Help
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-loom-cream">Loom Parts Quiz</h2>
          <p className="text-loom-muted text-sm">
            Question {state.questionIndex + 1} of {total} · Need {PASS_THRESHOLD}/{total} to pass
          </p>
        </div>
        <ProgressRing progress={progressPct} size={44} strokeWidth={4}>
          <span className="text-loom-gold text-[10px] font-bold">
            {state.questionIndex}/{total}
          </span>
        </ProgressRing>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-loom-raised rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-loom-gold rounded-full"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        {!isAdvancing && (
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="bg-loom-raised border border-loom-border rounded-xl p-4">
              <p className="text-loom-cream font-medium text-base leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="grid gap-2">
              {currentQ.options.map((option, i) => {
                const isSelected = currentAnswer?.selected === i;
                const isCorrect = i === currentQ.correct;
                const answered = !!currentAnswer;

                let optionStyle = 'bg-loom-raised border-loom-border text-loom-cream hover:border-loom-gold/50';
                if (answered) {
                  if (isCorrect) {
                    optionStyle = 'bg-loom-sage/20 border-loom-sage text-loom-cream';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-red-900/30 border-red-500/60 text-loom-cream';
                  } else {
                    optionStyle = 'bg-loom-raised border-loom-border text-loom-muted opacity-60';
                  }
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    whileHover={!answered ? { scale: 1.01, x: 4 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    disabled={answered}
                    className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm flex items-center gap-3 ${optionStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        answered && isCorrect
                          ? 'bg-loom-sage text-white'
                          : answered && isSelected && !isCorrect
                          ? 'bg-red-600 text-white'
                          : 'bg-loom-border text-loom-muted'
                      }`}
                    >
                      {answered && isCorrect ? '✓' : answered && isSelected ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && currentAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-xl p-4 border ${
                    currentAnswer.state === 'correct'
                      ? 'bg-loom-sage/10 border-loom-sage/30'
                      : 'bg-red-900/20 border-red-500/30'
                  }`}
                >
                  <div className="flex gap-2 items-start">
                    <span className="text-base flex-shrink-0">
                      {currentAnswer.state === 'correct' ? '✅' : '💡'}
                    </span>
                    <div>
                      <p className="text-loom-cream text-sm leading-relaxed">{currentQ.explanation}</p>
                      {currentAnswer.state === 'correct' && (
                        <p className="text-loom-gold text-xs font-semibold mt-1">+10 XP earned!</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            {currentAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
              >
                <button
                  onClick={() => setChatOpen(true)}
                  className="text-loom-muted text-xs hover:text-loom-gold transition-colors"
                >
                  🐦 Stuck? Ask Wren
                </button>
                <Button onClick={handleNext}>
                  {state.questionIndex < total - 1 ? 'Next Question →' : 'See Results →'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
