import type { PuzzleContent } from './event';

export const turingProtocol: PuzzleContent = {
  grid: [['T', 'H', 'A', 'W'], ['S', 'F', 'T', 'A'], ['A', 'T', 'S', 'H'], ['W', 'A', 'F', 'T']],
  rules: [
    'Coordinates are distributed throughout this site.',
    'The structure of this page is not decorative.',
    'Begin at 起点. End at 終点.',
    'Use the Japanese numeral key below. No external translation or search is needed.',
    'Each pair is row · column. For example, 二・三 means row 2, column 3. Arrows separate consecutive coordinates.',
    'Apply each coordinate to the grid.',
    'Read the resulting characters in sequence.',
    'Enter the resulting phrase. Letter case and whitespace do not matter.',
  ],
  clues: {
    hero: '起点：一・一 → 一・二',
    sequence: '次：一・三 → 二・三 → 一・四',
    about: '続：二・四 → 二・一',
    challenge: '次：二・二 → 三・一',
    actions: '終点：三・三 → 三・二',
  },
};
