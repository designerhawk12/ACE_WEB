import type { ClueSlot } from '../config/event';
import { useEventRuntime } from '../context/EventRuntime';

export function EventClue({ slot }: { slot: ClueSlot }) {
  const { phase, puzzle } = useEventRuntime();
  if (phase !== 'puzzle' && phase !== 'problem-unlocked') return null;

  const clue = puzzle?.clues[slot];
  if (!clue) return null;

  return <span className="eyebrow event-clue" lang="ja" data-clue-slot={slot}>{clue}</span>;
}
