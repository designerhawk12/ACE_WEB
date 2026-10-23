import { eventConfig, type ClueSlot } from '../config/event';

export function EventClue({ slot }: { slot: ClueSlot }) {
  if (eventConfig.eventPhase !== 'puzzle' && eventConfig.eventPhase !== 'problem-unlocked') return null;

  const clue = eventConfig.puzzle?.clues[slot];
  if (!clue) return null;

  return <span className="eyebrow event-clue" data-clue-slot={slot}>{clue}</span>;
}
