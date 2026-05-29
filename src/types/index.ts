export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpThreshold?: number;
  stageRequired?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  notes: string;
  stage: number;
  xpEarned: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface LoomPart {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  tip?: string;
  svgArea: { x: number; y: number; w: number; h: number };
  labelPos: { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
}

export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface StageInfo {
  id: StageId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  xpReward: number;
  steps: string[];
  badgeId?: string;
}

export interface StageProgress {
  currentStep: number;
  completedSteps: string[];
  startedAt: number | null;
  completedAt: number | null;
  quizScore?: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastDate: string | null;
}

export interface XPGain {
  amount: number;
  reason: string;
  timestamp: number;
}
