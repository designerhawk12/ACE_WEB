import { lazy, Suspense } from 'react';
import type { EventPhase } from '../config/event';
import { useEventRuntime } from '../context/EventRuntime';
import { ChallengeStatus } from './ChallengeStatus';

const PuzzlePhase = lazy(() => import('./PuzzlePhase'));

export function EventPhaseContent({ phase }: { phase: EventPhase }) {
  const { puzzle } = useEventRuntime();
  if ((phase !== 'puzzle' && phase !== 'problem-unlocked') || !puzzle) return <ChallengeStatus phase={phase} />;
  return <Suspense fallback={<ChallengeStatus phase="puzzle" />}><PuzzlePhase puzzle={puzzle} /></Suspense>;
}
