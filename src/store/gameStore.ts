import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, Badge, JournalEntry, StageProgress, StreakData, XPGain } from '../types';
import { ALL_BADGES } from '../data/badges';
import { STAGES } from '../data/stages';
import type { AIProvider } from '../lib/aiProvider';
import { DEFAULT_GROQ_MODEL } from '../lib/aiProvider';

interface GameState {
  // Core progression
  xp: number;
  level: number;
  earnedBadgeIds: string[];
  streak: StreakData;
  recentXPGains: XPGain[];

  // Navigation
  activeView: 'map' | 'stage';
  activeStage: number;
  unlockedStages: number[];
  completedStages: number[];
  stageProgress: Record<number, StageProgress>;

  // Chat
  messages: ChatMessage[];
  isChatOpen: boolean;
  isWrenTyping: boolean;

  // Journal
  journalEntries: JournalEntry[];

  // Settings — AI provider
  aiProvider: AIProvider;
  apiKey: string;       // Anthropic key (kept as 'apiKey' for localStorage compat)
  groqApiKey: string;
  groqModel: string;
  showApiKeyModal: boolean;

  // Celebration state
  pendingCelebration: { stageId: number; badgeId?: string } | null;

  // Actions
  setApiKey: (key: string) => void;
  setGroqApiKey: (key: string) => void;
  setGroqModel: (model: string) => void;
  setProvider: (provider: AIProvider) => void;
  setShowApiKeyModal: (show: boolean) => void;

  goToMap: () => void;
  goToStage: (stageId: number) => void;

  addXP: (amount: number, reason: string) => void;
  completeStep: (stageId: number, step: string) => void;
  completeStage: (stageId: number) => void;
  skipStage: (stageId: number) => void;
  setCurrentStep: (stageId: number, step: number) => void;
  setQuizScore: (stageId: number, score: number) => void;

  addBadge: (badgeId: string) => void;
  checkBadges: () => void;
  updateStreak: () => void;

  addMessage: (message: ChatMessage) => void;
  setChatOpen: (open: boolean) => void;
  setWrenTyping: (typing: boolean) => void;
  clearMessages: () => void;
  updateLastMessage: (content: string) => void;

  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;

  dismissCelebration: () => void;
}

const initStageProgress = (): StageProgress => ({
  currentStep: 0,
  completedSteps: [],
  startedAt: null,
  completedAt: null,
  quizScore: undefined,
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      earnedBadgeIds: [],
      streak: { current: 0, longest: 0, lastDate: null },
      recentXPGains: [],

      activeView: 'map',
      activeStage: 1,
      unlockedStages: [1],
      completedStages: [],
      stageProgress: { 1: initStageProgress() },

      messages: [],
      isChatOpen: false,
      isWrenTyping: false,

      journalEntries: [],

      aiProvider: 'anthropic',
      apiKey: '',
      groqApiKey: '',
      groqModel: DEFAULT_GROQ_MODEL,
      showApiKeyModal: false,

      pendingCelebration: null,

      setApiKey: (key) => set({ apiKey: key, showApiKeyModal: false }),
      setGroqApiKey: (key) => set({ groqApiKey: key, showApiKeyModal: false }),
      setGroqModel: (model) => set({ groqModel: model }),
      setProvider: (provider) => set({ aiProvider: provider }),
      setShowApiKeyModal: (show) => set({ showApiKeyModal: show }),

      goToMap: () => set({ activeView: 'map' }),
      goToStage: (stageId) => {
        const { stageProgress } = get();
        const progress = stageProgress[stageId] || initStageProgress();
        if (!progress.startedAt) {
          set({
            activeView: 'stage',
            activeStage: stageId,
            stageProgress: {
              ...stageProgress,
              [stageId]: { ...progress, startedAt: Date.now() },
            },
          });
        } else {
          set({ activeView: 'stage', activeStage: stageId });
        }
      },

      addXP: (amount, reason) => {
        const { xp, recentXPGains } = get();
        const newXP = xp + amount;
        const newLevel = Math.floor(newXP / 150) + 1;
        const gain: XPGain = { amount, reason, timestamp: Date.now() };
        set({
          xp: newXP,
          level: newLevel,
          recentXPGains: [gain, ...recentXPGains].slice(0, 5),
        });
        // Check XP-based badges after XP update
        setTimeout(() => get().checkBadges(), 50);
      },

      completeStep: (stageId, step) => {
        const { stageProgress } = get();
        const progress = stageProgress[stageId] || initStageProgress();
        if (progress.completedSteps.includes(step)) return;
        set({
          stageProgress: {
            ...stageProgress,
            [stageId]: {
              ...progress,
              completedSteps: [...progress.completedSteps, step],
            },
          },
        });
        get().addXP(25, `Completed step: ${step}`);
      },

      completeStage: (stageId) => {
        const { completedStages, unlockedStages, stageProgress, earnedBadgeIds } = get();
        if (completedStages.includes(stageId)) return;

        const progress = stageProgress[stageId] || initStageProgress();
        const nextStage = stageId + 1;
        const newUnlocked = nextStage <= 9 && !unlockedStages.includes(nextStage)
          ? [...unlockedStages, nextStage]
          : unlockedStages;

        const newStageProgress = { ...stageProgress };
        if (!newStageProgress[nextStage] && nextStage <= 9) {
          newStageProgress[nextStage] = initStageProgress();
        }

        set({
          completedStages: [...completedStages, stageId],
          unlockedStages: newUnlocked,
          stageProgress: {
            ...newStageProgress,
            [stageId]: { ...progress, completedAt: Date.now() },
          },
        });

        // Give stage XP reward
        const stage = STAGES.find((s) => s.id === stageId);
        if (stage) {
          get().addXP(stage.xpReward, `Completed Stage ${stageId}: ${stage.name}`);
        }

        // Award stage badge
        if (stage?.badgeId && !earnedBadgeIds.includes(stage.badgeId)) {
          get().addBadge(stage.badgeId as string);
        }

        // Trigger celebration
        set({
          pendingCelebration: { stageId, badgeId: stage?.badgeId },
        });
      },

      skipStage: (stageId) => {
        const { completedStages, unlockedStages, stageProgress, earnedBadgeIds } = get();
        if (completedStages.includes(stageId)) return;

        const stage = STAGES.find((s) => s.id === stageId);
        const nextStage = stageId + 1;
        const newUnlocked = nextStage <= 9 && !unlockedStages.includes(nextStage)
          ? [...unlockedStages, nextStage]
          : unlockedStages;

        const allSteps = stage?.steps ?? [];
        const newStageProgress = { ...stageProgress };
        newStageProgress[stageId] = {
          ...(newStageProgress[stageId] || initStageProgress()),
          completedSteps: allSteps,
          completedAt: Date.now(),
        };
        if (!newStageProgress[nextStage] && nextStage <= 9) {
          newStageProgress[nextStage] = initStageProgress();
        }

        set({
          completedStages: [...completedStages, stageId],
          unlockedStages: newUnlocked,
          stageProgress: newStageProgress,
        });

        if (stage?.badgeId && !earnedBadgeIds.includes(stage.badgeId)) {
          get().addBadge(stage.badgeId as string);
        }
      },

      setCurrentStep: (stageId, step) => {
        const { stageProgress } = get();
        const progress = stageProgress[stageId] || initStageProgress();
        set({
          stageProgress: {
            ...stageProgress,
            [stageId]: { ...progress, currentStep: step },
          },
        });
      },

      setQuizScore: (stageId, score) => {
        const { stageProgress } = get();
        const progress = stageProgress[stageId] || initStageProgress();
        set({
          stageProgress: {
            ...stageProgress,
            [stageId]: { ...progress, quizScore: score },
          },
        });
      },

      addBadge: (badgeId) => {
        const { earnedBadgeIds } = get();
        if (earnedBadgeIds.includes(badgeId)) return;
        set({ earnedBadgeIds: [...earnedBadgeIds, badgeId] });
      },

      checkBadges: () => {
        const { xp, streak, earnedBadgeIds } = get();
        const toUnlock: string[] = [];

        if (xp >= 100 && !earnedBadgeIds.includes('century')) toUnlock.push('century');
        if (xp >= 500 && !earnedBadgeIds.includes('five-hundred')) toUnlock.push('five-hundred');
        if (streak.current >= 3 && !earnedBadgeIds.includes('streak-3')) toUnlock.push('streak-3');
        if (streak.current >= 7 && !earnedBadgeIds.includes('streak-7')) toUnlock.push('streak-7');

        if (toUnlock.length > 0) {
          set({ earnedBadgeIds: [...earnedBadgeIds, ...toUnlock] });
        }
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { streak } = get();

        if (streak.lastDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const newCurrent = streak.lastDate === yesterdayStr ? streak.current + 1 : 1;
        set({
          streak: {
            current: newCurrent,
            longest: Math.max(streak.longest, newCurrent),
            lastDate: today,
          },
        });

        setTimeout(() => get().checkBadges(), 50);
      },

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      setChatOpen: (open) => set({ isChatOpen: open }),
      setWrenTyping: (typing) => set({ isWrenTyping: typing }),
      clearMessages: () => set({ messages: [] }),

      updateLastMessage: (content) =>
        set((state) => {
          const msgs = [...state.messages];
          if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
            msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
          }
          return { messages: msgs };
        }),

      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [
            { ...entry, id: `journal-${Date.now()}` },
            ...state.journalEntries,
          ],
        })),

      dismissCelebration: () => set({ pendingCelebration: null }),
    }),
    {
      name: 'loom-studio-buddy',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        earnedBadgeIds: state.earnedBadgeIds,
        streak: state.streak,
        unlockedStages: state.unlockedStages,
        completedStages: state.completedStages,
        stageProgress: state.stageProgress,
        messages: state.messages,
        journalEntries: state.journalEntries,
        apiKey: state.apiKey,
        groqApiKey: state.groqApiKey,
        groqModel: state.groqModel,
        aiProvider: state.aiProvider,
      }),
    }
  )
);

export const selectEarnedBadges = (state: GameState): Badge[] =>
  ALL_BADGES.filter((b) => state.earnedBadgeIds.includes(b.id));

export const selectStageProgress = (stageId: number) => (state: GameState) =>
  state.stageProgress[stageId] || { currentStep: 0, completedSteps: [], startedAt: null, completedAt: null };
