import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PuzzleContent } from '../config/event';
import { useEventRuntime } from '../context/EventRuntime';
import { feedbackForWrongAttempt, MAX_WRONG_ATTEMPTS, verifyAnswer } from '../lib/puzzleVerifier';
import { PuzzleChallenge } from './PuzzleChallenge';
import { PuzzleSuccess } from './PuzzleSuccess';
import { SubmissionNextSteps } from './SubmissionNextSteps';
import { canSolveAt } from '../config/schedule';
import { ScheduleReadout } from './ScheduleReadout';

const ATTEMPTS_KEY = 'ace-human-test-attempts';

function readAttempts(): number {
  try {
    const value = Number(sessionStorage.getItem(ATTEMPTS_KEY));
    return value === 1 || value === 2 ? value : 0;
  } catch { return 0; }
}

export default function PuzzlePhase({ puzzle }: { puzzle: PuzzleContent }) {
  const { accessGranted, challengeOpen, markSolved, reset, isDevPreview, manualOverride } = useEventRuntime();
  const reduced = useReducedMotion();
  const [attempts, setAttempts] = useState(readAttempts);
  const attemptsRef = useRef(attempts);
  const [feedback, setFeedback] = useState('');
  const [completionMessage, setCompletionMessage] = useState('HUMAN ENOUGH.');
  const completedRef = useRef(false);
  const successRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusAfterSolve = useRef(false);

  useEffect(() => {
    ScrollTrigger.refresh();
    if (accessGranted && focusAfterSolve.current) {
      successRef.current?.focus({ preventScroll: true });
      focusAfterSolve.current = false;
    }
  }, [accessGranted]);

  const submit = (answer: string) => {
    if (completedRef.current || accessGranted || !challengeOpen || !canSolveAt(Date.now(), isDevPreview, manualOverride)) return;
    if (verifyAnswer(answer)) {
      completedRef.current = true;
      focusAfterSolve.current = true;
      setCompletionMessage('HUMAN ENOUGH.');
      try { sessionStorage.removeItem(ATTEMPTS_KEY); } catch { /* In-memory attempt state still works. */ }
      markSolved();
      return;
    }
    const nextAttempt = attemptsRef.current + 1;
    attemptsRef.current = nextAttempt;
    setAttempts(nextAttempt);
    const message = feedbackForWrongAttempt(nextAttempt);
    if (nextAttempt >= MAX_WRONG_ATTEMPTS) {
      completedRef.current = true;
      focusAfterSolve.current = true;
      setCompletionMessage(message);
      try { sessionStorage.removeItem(ATTEMPTS_KEY); } catch { /* In-memory attempt state still works. */ }
      markSolved();
      return;
    }
    setFeedback(message);
    try { sessionStorage.setItem(ATTEMPTS_KEY, String(nextAttempt)); } catch { /* In-memory attempt state still works. */ }
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  };
  const resetPuzzle = () => {
    reset(); setAttempts(0); attemptsRef.current = 0; setFeedback(''); setCompletionMessage('HUMAN ENOUGH.'); completedRef.current = false;
    try { sessionStorage.removeItem(ATTEMPTS_KEY); } catch { /* In-memory reset still works. */ }
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  };

  return <motion.section className="challenge section-rule puzzle-stage" id="challenge" aria-labelledby="challenge-title" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.35 }}>
    <div className="puzzle-stage__header"><div className="section-index"><span className="index-number">04</span><span className="index-line" aria-hidden="true" /><span className="eyebrow">RECONSTRUCTION SEQUENCE / 001</span></div><ScheduleReadout kind="challenge" className="puzzle-stage__timer" /></div>
    {accessGranted ? <>
      <PuzzleSuccess headingRef={successRef} message={completionMessage} />
      <SubmissionNextSteps />
    </> : <PuzzleChallenge content={puzzle} onSubmitAnswer={submit} feedback={feedback} attempts={attempts} locked={!challengeOpen} inputRef={inputRef} />}
    {import.meta.env.DEV && isDevPreview && <button className="puzzle-reset" type="button" onClick={resetPuzzle}>DEV PREVIEW / RESET PUZZLE</button>}
  </motion.section>;
}
