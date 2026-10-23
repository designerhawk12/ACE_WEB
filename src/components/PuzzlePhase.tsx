import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ProblemStatement, PuzzleContent } from '../config/event';
import { ProblemStatementReveal } from './ProblemStatementReveal';
import { PuzzleChallenge } from './PuzzleChallenge';
import { PuzzleSuccess } from './PuzzleSuccess';

type PuzzlePhaseProps = {
  puzzle: PuzzleContent;
  problemStatement: ProblemStatement | null;
  accessGranted: boolean;
  feedback?: string;
  onSubmitAnswer?: (answer: string) => void;
};

export default function PuzzlePhase({ puzzle, problemStatement, accessGranted, feedback, onSubmitAnswer }: PuzzlePhaseProps) {
  const shouldReduceMotion = useReducedMotion() === true;
  const transition = { duration: shouldReduceMotion ? 0 : 0.3 };

  return (
    <AnimatePresence mode="wait">
      {accessGranted && problemStatement ? (
        <motion.div key="unlocked" initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition}>
          <PuzzleSuccess />
          <ProblemStatementReveal statement={problemStatement} />
        </motion.div>
      ) : (
        <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
          <PuzzleChallenge content={puzzle} feedback={feedback} onSubmitAnswer={onSubmitAnswer} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
