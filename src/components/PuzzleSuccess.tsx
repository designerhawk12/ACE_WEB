import type { RefObject } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function PuzzleSuccess({ headingRef }: { headingRef: RefObject<HTMLHeadingElement | null> }) {
  const reduced = useReducedMotion();
  return <motion.div className="puzzle-success" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.3 }}>
    <p className="eyebrow challenge__kicker">PHASE 02 / UNLOCKED</p>
    <h2 id="challenge-title" ref={headingRef} tabIndex={-1}>ACCESS GRANTED</h2>
  </motion.div>;
}
