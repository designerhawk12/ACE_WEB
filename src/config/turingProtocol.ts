import type { PuzzleContent } from './event';

export const turingProtocol: PuzzleContent = {
  grid: [['T', 'E', 'A', 'V'], ['R', 'N', 'O', 'R'], ['I', 'E', 'G', 'H'], ['S', 'L', 'E', 'D']],
  rules: [
    'Seven coordinates are distributed throughout the site. Collect the annotation fragments, then read them in page order.',
    'Each coordinate is written as row · column. Arrows separate consecutive coordinates; keep their written order.',
    'Use the Japanese numeral key below. No translation or external search is needed.',
    'Use each resulting coordinate on the letter grid. Read the extracted letters in sequence.',
    'Enter the resulting word. Letter case and surrounding spaces do not matter.',
  ],
  clues: {
    hero: '起点：二・一',
    sequence: '次：四・三 → 一・四',
    about: '続：三・二',
    challenge: '反転：二・四 → 四・一',
    footer: '終点：一・二',
  },
};
