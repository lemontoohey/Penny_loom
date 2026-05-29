import type { QuizQuestion } from '../types';

export const STAGE1_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What are the lengthwise (vertical) threads strung on the loom called?',
    options: ['Weft threads', 'Warp threads', 'Selvedge threads', 'Heddle threads'],
    correct: 1,
    explanation:
      'The warp threads run vertically (lengthwise) through the loom. They are set up first — before any weaving begins — and remain stationary while the weft is woven through them.',
  },
  {
    id: 'q2',
    question: 'What creates the opening called the "shed" for the weft thread to pass through?',
    options: [
      'Swinging the beater forward',
      'Lifting one or more shafts',
      'Throwing the shuttle',
      'Winding the cloth beam',
    ],
    correct: 1,
    explanation:
      'When you lift a shaft (or multiple shafts), the warp threads attached to those heddles rise up, creating a triangular opening called the shed. The shuttle passes through this gap.',
  },
  {
    id: 'q3',
    question: 'What is the purpose of the heddles?',
    options: [
      'To pack weft threads firmly into place',
      'To hold the reed in position in the beater',
      'To hold individual warp threads and lift them when a shaft is raised',
      'To keep the selvedge edges tidy',
    ],
    correct: 2,
    explanation:
      'Each warp thread passes through the eye of one heddle. When a shaft is raised, all the heddles on that shaft lift their warp threads simultaneously — that\'s how the shed is formed.',
  },
  {
    id: 'q4',
    question: 'On your 4-shaft table loom, how many independently controlled shaft groups do you have?',
    options: ['2', '3', '4', '8'],
    correct: 2,
    explanation:
      'A 4-shaft loom has exactly 4 shaft frames, each of which can be raised independently. This gives you 15 possible shed combinations — enough for plain weave, twills, basket weave and many other structures!',
  },
  {
    id: 'q5',
    question: 'What does the beater do?',
    options: [
      'Opens the shed for the shuttle to pass through',
      'Holds and carries the weft yarn',
      'Packs each weft thread firmly into the weave',
      'Winds the warp onto the beam',
    ],
    correct: 2,
    explanation:
      'After throwing the shuttle and closing the shed, you swing the beater firmly toward you to pack the new weft thread snugly against the previous row. This consistent beating is what builds up an even cloth.',
  },
  {
    id: 'q6',
    question: 'What is the shuttle used for?',
    options: [
      'Threading the heddles before weaving starts',
      'Carrying the weft yarn across the shed from selvedge to selvedge',
      'Adjusting the tension on the warp beam',
      'Measuring the sett of the reed',
    ],
    correct: 1,
    explanation:
      'The shuttle holds a bobbin of weft yarn and is thrown or passed across the shed, laying in the horizontal weft thread as it travels. It comes in different sizes depending on your loom width.',
  },
  {
    id: 'q7',
    question: 'Where does the finished cloth collect as you weave?',
    options: ['On the warp beam', 'On the back beam', 'On the cloth beam', 'On the breast beam'],
    correct: 2,
    explanation:
      'The cloth beam (at the front of the loom) winds up the finished cloth as you weave. You advance it regularly — called "advancing the warp" — to keep the fell line (where weaving is happening) in a comfortable position.',
  },
  {
    id: 'q8',
    question: 'What are the self-finished edges running along both sides of woven cloth called?',
    options: ['Warp ends', 'Weft picks', 'Selvedges', 'Lease sticks'],
    correct: 2,
    explanation:
      'The selvedges (or selvages) are the self-finished edges of the cloth, formed when the weft loops back on itself at each side. Clean, consistent selvedges are a hallmark of good weaving technique!',
  },
];
