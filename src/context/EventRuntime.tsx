import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { eventConfig, type EventPhase, type PuzzleContent } from '../config/event';
import { enigmaProtocol } from '../config/enigmaProtocol';
import { canSolveAt, getPhaseForWindow } from '../config/schedule';
import { useScheduleWindow } from '../hooks/useEventClock';

const SESSION_KEY = 'ace-puzzle-unlocked';
// Old protocol solutions must not unlock this revised reconstruction.
const SESSION_REVISION = 'enigma-protocol-001';
type EventRuntime = {
  phase: EventPhase;
  isDevPreview: boolean;
  accessGranted: boolean;
  challengeOpen: boolean;
  puzzle: PuzzleContent | null;
  markSolved: () => void;
  reset: () => void;
};
const EventContext = createContext<EventRuntime | null>(null);

export function EventProvider({ children }: { children: ReactNode }) {
  const [isDevPreview] = useState(() => import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === 'puzzle');
  const scheduleWindow = useScheduleWindow();
  const [solved, setSolved] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === SESSION_REVISION; } catch { return false; }
  });
  const markSolved = useCallback(() => {
    if (!canSolveAt(Date.now(), isDevPreview)) return;
    setSolved(true);
    try { sessionStorage.setItem(SESSION_KEY, SESSION_REVISION); } catch { /* In-memory unlock still works. */ }
  }, [isDevPreview]);
  const reset = useCallback(() => {
    setSolved(false);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Storage can be unavailable. */ }
  }, []);
  const phase = getPhaseForWindow(scheduleWindow, eventConfig.eventPhase, isDevPreview, solved);
  const puzzleActive = phase === 'puzzle' || phase === 'problem-unlocked';
  const challengeOpen = scheduleWindow === 'live' || (scheduleWindow === 'upcoming' && isDevPreview);
  return <EventContext.Provider value={{
    phase, isDevPreview, accessGranted: puzzleActive && solved, challengeOpen,
    puzzle: puzzleActive ? eventConfig.puzzle ?? enigmaProtocol : null,
    markSolved, reset,
  }}>{children}</EventContext.Provider>;
}

export function useEventRuntime() {
  const value = useContext(EventContext);
  if (!value) throw new Error('Event components require EventProvider.');
  return value;
}
