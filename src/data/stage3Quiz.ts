import type { QuizQuestion } from '../types';

export const STAGE3_QUIZ: QuizQuestion[] = [
  {
    id: 's3q1',
    question: 'In which direction do you typically thread a 4-shaft loom?',
    options: [
      'Left to right, following the threading draft from the top',
      'Right to left, working from the right selvedge toward the left',
      'From the back shafts forward (shaft 4 first, then shaft 1)',
      'It doesn\'t matter as long as every thread is on some shaft',
    ],
    correct: 1,
    explanation:
      'Threading goes right to left — you start at the right selvedge and work toward the left. This is because the threading draft is read right to left, matching the order the threads sit on the warp beam. Most experienced weavers also thread from behind the castle, reaching forward through the heddles.',
  },
  {
    id: 's3q2',
    question: 'What does a threading draft tell you?',
    options: [
      'The order in which to lift shafts when weaving',
      'How many weft picks to weave before changing colour',
      'Which shaft each individual warp thread passes through',
      'The correct sett for your chosen yarn weight',
    ],
    correct: 2,
    explanation:
      'The threading draft is a grid: rows represent shafts (1–4), columns represent individual warp threads. A filled square means "this thread goes through this shaft." It\'s your road map for the entire threading process.',
  },
  {
    id: 's3q3',
    question: 'For a straight draw threading (1–2–3–4 repeat), what shaft comes after shaft 4?',
    options: ['Shaft 4 again', 'Shaft 3 (reversing direction)', 'Shaft 1 (starting the repeat over)', 'The sequence is complete — no more threads'],
    correct: 2,
    explanation:
      'A straight draw repeats: 1, 2, 3, 4, 1, 2, 3, 4… all the way across the warp. It\'s the most versatile threading because it lets you weave plain weave, 4-shaft twills, and many other structures using the same threading.',
  },
  {
    id: 's3q4',
    question: 'What tool do you use to pull individual warp threads through heddle eyes?',
    options: [
      'A shuttle',
      'A threading hook (heddle hook)',
      'A lease stick',
      'The end of the beater',
    ],
    correct: 1,
    explanation:
      'A threading hook (or heddle hook) is a small metal hook — like a crochet hook but thinner. You push it through the heddle eye from front to back, hook the warp thread, and pull it through. Some weavers prefer a bent wire or a slim crochet hook — use whatever you can control precisely.',
  },
  {
    id: 's3q5',
    question: 'What is a threading error and why does it matter?',
    options: [
      'A thread with uneven tension — it will pop during weaving',
      'A thread on the wrong shaft — it will weave the wrong structure',
      'A thread that passed through two heddle eyes — it will break under the stress',
      'A thread that skipped the reed — it will lie outside the selvedge',
    ],
    correct: 1,
    explanation:
      'A threading error means a thread is on the wrong shaft, so it lifts at the wrong time. The result is a visible "mistake" in the weave structure — often a float where there shouldn\'t be one. It\'s much easier to check and fix before you start weaving than to unpick rows of cloth later.',
  },
  {
    id: 's3q6',
    question: 'How do you check your threading before moving on to sleying the reed?',
    options: [
      'Lift each shaft in turn and look through the shed with a light behind the warp',
      'Weave several picks of weft and look for pattern errors',
      'Count heddles on each shaft and make sure they\'re equal',
      'Run your fingers across the warp to feel for crossed threads',
    ],
    correct: 0,
    explanation:
      'Lift shaft 1 and look at which threads rise — they should match your draft. Then lift shaft 2, 3 and 4 in turn. Hold a light behind the warp for clarity. If any thread rises on the wrong shaft, you\'ll see it immediately. Fix it now, before the reed goes on.',
  },
  {
    id: 's3q7',
    question: 'In a threading draft, threads are numbered from right to left. Thread 1 is on shaft 1, thread 2 on shaft 2. What is a "point twill" threading?',
    options: [
      '1, 2, 3, 4, 1, 2, 3, 4 — a straight repeating sequence',
      '1, 2, 3, 4, 3, 2, 1, 2, 3, 4… — it goes up then reverses back down',
      '4, 3, 2, 1, 4, 3, 2, 1 — a reverse straight draw',
      '1, 3, 2, 4, 1, 3, 2, 4 — alternating odd and even shafts',
    ],
    correct: 1,
    explanation:
      'A point twill threads 1–2–3–4–3–2 and repeats. This "V" shape in the draft creates a herringbone or chevron pattern in the finished cloth. It\'s one of the most beautiful threadings on 4 shafts and uses exactly the same set of lift plans as a straight draw.',
  },
  {
    id: 's3q8',
    question: 'You\'ve finished threading. You lift shaft 1 and notice 3 threads rise that should belong to shaft 2. What do you do?',
    options: [
      'Start the whole threading over from scratch',
      'Remove those 3 threads from shaft 1\'s heddles and re-thread them through shaft 2 heddles',
      'Just leave it — 3 threads won\'t make a visible difference',
      'Adjust the tie-up instead to compensate',
    ],
    correct: 1,
    explanation:
      'Fix it before you sley the reed! Use your threading hook to slip each misplaced thread out of its current heddle, find the correct shaft, and pull it through the right heddle. It takes 2 minutes now and saves you hours of unpicking woven cloth later.',
  },
];
