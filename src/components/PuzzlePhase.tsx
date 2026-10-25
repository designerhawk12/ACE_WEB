import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PuzzleContent } from '../config/event';
import { useEventRuntime } from '../context/EventRuntime';
import { rejectionMessage, verifyAnswer } from '../lib/puzzleVerifier';
import { ProblemStatementReveal } from './ProblemStatementReveal';
import { PuzzleChallenge } from './PuzzleChallenge';
import { PuzzleSuccess } from './PuzzleSuccess';
import { SubmissionNextSteps } from './SubmissionNextSteps';
import { canSolveAt } from '../config/schedule';
import { ScheduleReadout } from './ScheduleReadout';

export default function PuzzlePhase({ puzzle }: { puzzle: PuzzleContent }) {
  const { accessGranted, challengeOpen, markSolved, reset, isDevPreview, statement } = useEventRuntime();
  const reduced = useReducedMotion();
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'accepted'>('idle');
  const busy = useRef(false);
  const mounted = useRef(true);
  const successRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusAfterSolve = useRef(false);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    ScrollTrigger.refresh();
    if (accessGranted && focusAfterSolve.current) {
      successRef.current?.focus({ preventScroll: true });
      focusAfterSolve.current = false;
    }
  }, [accessGranted, statement]);

  const submit = async (answer: string) => {
    if (busy.current || accessGranted || !challengeOpen || !canSolveAt(Date.now(), isDevPreview)) return;
    busy.current = true;
    setStatus('checking');
    try {
      const correct = await verifyAnswer(answer);
      if (!mounted.current) return;
      if (!canSolveAt(Date.now(), isDevPreview)) {
        setFeedback('CHALLENGE ENDED.');
        setStatus('idle');
        busy.current = false;
        return;
      }
      if (correct) {
        focusAfterSolve.current = true;
        setStatus('accepted');
        setFeedback('RECONSTRUCTION VERIFIED. Confirming access.');
      } else {
        setFeedback(rejectionMessage);
        setAttempts(count => count + 1);
        setStatus('idle');
        busy.current = false;
        requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
      }
    } catch {
      if (!mounted.current) return;
      setFeedback('Verification is unavailable. Use HTTPS or localhost, then try again.');
      setStatus('idle');
      busy.current = false;
    }
  };
  const resetPuzzle = () => {
    reset(); setAttempts(0); setFeedback(''); setStatus('idle'); busy.current = false;
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  };

  return <motion.section className="challenge section-rule puzzle-stage" id="challenge" aria-labelledby="challenge-title" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.35 }}>
    <div className="puzzle-stage__header"><div className="section-index"><span className="index-number">04</span><span className="index-line" aria-hidden="true" /><span className="eyebrow">RECONSTRUCTION SEQUENCE / 001</span></div><ScheduleReadout kind="challenge" className="puzzle-stage__timer" /></div>
    {accessGranted ? <>
      <PuzzleSuccess headingRef={successRef} />
      {statement ? <ProblemStatementReveal statement={statement} development={isDevPreview} />
        : <p className="puzzle-stage__pending" role="status">Your reconstruction is verified. The event brief is awaiting release.</p>}
      <SubmissionNextSteps />
    </> : <PuzzleChallenge content={puzzle} onSubmitAnswer={submit} feedback={feedback} attempts={attempts} locked={status !== 'idle' || !challengeOpen} inputRef={inputRef} />}
    {status === 'accepted' && !accessGranted && <motion.div className="puzzle-confirmation" aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduced ? 0 : 0.65, ease: 'easeInOut' }} onAnimationComplete={markSolved} />}
    {import.meta.env.DEV && isDevPreview && <button className="puzzle-reset" type="button" onClick={resetPuzzle}>DEV PREVIEW / RESET PUZZLE</button>}
  </motion.section>;
}
