import type { QuizQuestion } from '../types';

export const STAGE2_QUIZ: QuizQuestion[] = [
  {
    id: 's2q1',
    question: 'What does "sett" refer to in weaving?',
    options: [
      'The pattern of over/under in the weave structure',
      'The number of warp threads per centimetre or inch',
      'The knot used to tie on to the cloth beam',
      'The distance between the front and back beams',
    ],
    correct: 1,
    explanation:
      'Sett is the number of warp ends (threads) per unit of width — usually expressed as ends per inch (EPI) or ends per centimetre. A medium wool might be sett at 10 EPI; a fine cotton at 20 EPI. Getting sett right is the single most important planning decision.',
  },
  {
    id: 's2q2',
    question: 'Why do you wind a cross (lease) when measuring the warp on the warping board?',
    options: [
      'To make the warp threads stronger',
      'To add extra length for fringe',
      'To keep every thread in its exact order from start to finish',
      'To prevent the yarn from tangling on the beam rod',
    ],
    correct: 2,
    explanation:
      'The cross — that figure-8 around two pegs — locks every thread in sequence. Without it, threads would cross randomly, making threading the heddles a nightmare. Protect the cross at all costs!',
  },
  {
    id: 's2q3',
    question: 'What is "loom waste"?',
    options: [
      'Broken threads you have to replace mid-project',
      'Warp length that cannot be woven because of the loom\'s physical structure',
      'The cut-off fringe edges after wet-finishing',
      'Threads that miss the heddle eye during threading',
    ],
    correct: 1,
    explanation:
      'Every loom has a built-in waste zone — the warp between the beams that you can never weave. On most 4-shaft table looms this is roughly 50–75 cm. Always add this to your planned warp length, or your project will come up short.',
  },
  {
    id: 's2q4',
    question: 'You want a woven piece 25 cm wide at a sett of 8 ends per centimetre. How many warp ends do you need?',
    options: ['25', '33', '200', '400'],
    correct: 2,
    explanation:
      '25 cm × 8 ends/cm = 200 ends. Width × sett = ends. This is the core calculation you\'ll do for every project. Don\'t forget to add a few extra ends for selvedge reinforcement if needed.',
  },
  {
    id: 's2q5',
    question: 'When you "chain" the warp off the warping board, what are you protecting?',
    options: [
      'The colour sequence of your yarn',
      'The cross and the equal length of every thread',
      'The weave structure you\'ve planned',
      'The reed spacing you calculated',
    ],
    correct: 1,
    explanation:
      'Chaining keeps the warp tangle-free for transport and preserves the cross. Remove the warp from the far end of the board first, chain toward the cross, and always secure the cross with a tie before removing it from the pegs.',
  },
  {
    id: 's2q6',
    question: 'When beaming the warp (winding it onto the warp beam), what do you place between layers?',
    options: [
      'A piece of the reed',
      'Tissue paper to prevent damage',
      'Firm packing paper, cardboard or sticks',
      'A sheet of bubble wrap',
    ],
    correct: 2,
    explanation:
      'Packing separates each layer of warp so threads don\'t sink into previous layers and create uneven tension. Use brown craft paper, corrugated cardboard, or wooden sticks cut to beam width. Uneven tension from bad beaming causes problems throughout the whole project.',
  },
  {
    id: 's2q7',
    question: 'You\'re planning a scarf 200 cm long. You add 60 cm loom waste and 10 cm take-up. What total warp length do you wind?',
    options: ['200 cm', '210 cm', '260 cm', '270 cm'],
    correct: 3,
    explanation:
      '200 (weaving length) + 60 (loom waste) + 10 (take-up and draw-in) = 270 cm. Take-up is the extra length consumed as threads travel over and under each other. A good rule: add ~10% for take-up on top of your loom waste.',
  },
  {
    id: 's2q8',
    question: 'What does "winding on under tension" mean when beaming?',
    options: [
      'Pulling the warp very tight so it won\'t unwind',
      'Keeping a firm, even tension on all threads as you crank the warp beam',
      'Tying the warp tightly to the apron rod',
      'Using a separate tension box device for each thread',
    ],
    correct: 1,
    explanation:
      'Tension while beaming means holding the warp snug (not tight) and even as a colleague or weight pulls from the front while you wind. Consistent tension during beaming = consistent tension during weaving = even, beautiful cloth.',
  },
];
