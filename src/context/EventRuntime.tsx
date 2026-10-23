import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { eventConfig, type EventPhase, type ProblemStatement, type PuzzleContent } from '../config/event';
import { turingProtocol } from '../config/turingProtocol';

const SESSION_KEY = 'ace-puzzle-unlocked';
// Old protocol solutions must not unlock this revised reconstruction.
const SESSION_REVISION = 'turing-protocol-002';
type EventRuntime = {
  phase: EventPhase;
  isDevPreview: boolean;
  accessGranted: boolean;
  puzzle: PuzzleContent | null;
  statement: ProblemStatement | null;
  markSolved: () => void;
  reset: () => void;
};
const EventContext = createContext<EventRuntime | null>(null);

export function EventProvider({ children }: { children: ReactNode }) {
  const [isDevPreview] = useState(() => import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === 'puzzle');
  const configuredPhase = isDevPreview ? 'puzzle' : eventConfig.eventPhase;
  const puzzleActive = configuredPhase === 'puzzle' || configuredPhase === 'problem-unlocked';
  const [accessGranted, setAccessGranted] = useState(() => {
    if (!puzzleActive) return false;
    try { return sessionStorage.getItem(SESSION_KEY) === SESSION_REVISION; } catch { return false; }
  });
  const [previewStatement, setPreviewStatement] = useState<ProblemStatement | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (import.meta.env.DEV && isDevPreview) {
      void import('../config/puzzlePreview').then(module => {
        if (!cancelled) setPreviewStatement(module.previewStatement);
      });
    }
    return () => { cancelled = true; };
  }, [isDevPreview]);
  const markSolved = useCallback(() => {
    setAccessGranted(true);
    try { sessionStorage.setItem(SESSION_KEY, SESSION_REVISION); } catch { /* In-memory unlock still works. */ }
  }, []);
  const reset = useCallback(() => {
    setAccessGranted(false);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Storage can be unavailable. */ }
  }, []);
  const phase = puzzleActive && accessGranted ? 'problem-unlocked' : configuredPhase;
  return <EventContext.Provider value={{
    phase, isDevPreview, accessGranted: puzzleActive && accessGranted,
    puzzle: puzzleActive ? eventConfig.puzzle ?? turingProtocol : null,
    statement: puzzleActive ? isDevPreview ? previewStatement : eventConfig.problemStatement : null,
    markSolved, reset,
  }}>{children}</EventContext.Provider>;
}

export function useEventRuntime() {
  const value = useContext(EventContext);
  if (!value) throw new Error('Event components require EventProvider.');
  return value;
}
