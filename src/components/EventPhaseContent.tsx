import { lazy, Suspense } from 'react';
import { eventConfig, type EventPhase } from '../config/event';
import { ChallengeStatus } from './ChallengeStatus';

const PuzzlePhase = lazy(() => import('./PuzzlePhase'));

type EventPhaseContentProps = {
  phase: EventPhase;
  accessGranted?: boolean;
  feedback?: string;
  onSubmitAnswer?: (answer: string) => void;
};

export function EventPhaseContent({ phase, accessGranted = false, feedback, onSubmitAnswer }: EventPhaseContentProps) {
  const fallbackPhase = phase === 'problem-unlocked' && (!accessGranted || !eventConfig.problemStatement)
    ? 'puzzle'
    : phase;

  // Teaser never imports or mounts the puzzle. Missing content also fails closed.
  if ((phase !== 'puzzle' && phase !== 'problem-unlocked') || !eventConfig.puzzle) {
    return <ChallengeStatus phase={fallbackPhase} />;
  }

  return (
    <Suspense fallback={<ChallengeStatus phase={fallbackPhase} />}>
      <PuzzlePhase
        accessGranted={accessGranted}
        feedback={feedback}
        onSubmitAnswer={onSubmitAnswer}
        problemStatement={eventConfig.problemStatement}
        puzzle={eventConfig.puzzle}
      />
    </Suspense>
  );
}
