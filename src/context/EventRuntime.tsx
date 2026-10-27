import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { eventConfig, type EventPhase, type PuzzleContent } from '../config/event';
import { canSolveAt, getPhaseForWindow, type ManualPhaseOverride } from '../config/schedule';
import { useScheduleWindow } from '../hooks/useEventClock';

const SESSION_KEY = 'ace-puzzle-unlocked';
// Keep the existing revision so participants who already solved the challenge stay unlocked.
const SESSION_REVISION = 'enigma-protocol-001';
type EventRuntime = {
  phase: EventPhase;
  isDevPreview: boolean;
  accessGranted: boolean;
  hasSolvedPuzzle: boolean;
  challengeOpen: boolean;
  puzzle: PuzzleContent | null;
  manualOverride: ManualPhaseOverride;
  applyManualOverride: (value: ManualPhaseOverride) => void;
  markSolved: () => void;
  reset: () => void;
};
const EventContext = createContext<EventRuntime | null>(null);

export function EventProvider({ children }: { children: ReactNode }) {
  const [isDevPreview] = useState(() => import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === 'puzzle');
  const scheduleWindow = useScheduleWindow();
  const [manualOverride, setManualOverride] = useState<ManualPhaseOverride>(null);
  const localWriteUntilRef = useRef(0);
  const applyManualOverride = useCallback((value: ManualPhaseOverride) => {
    // Global Config reads can lag a successful write by a few seconds.
    localWriteUntilRef.current = Date.now() + 10000;
    setManualOverride(value);
  }, []);
  const refreshOverride = useCallback(async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch('/api/event-phase', { cache: 'no-store', credentials: 'same-origin', signal: controller.signal });
      if (!response.ok) throw new Error('Status unavailable');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || !('manualPhaseOverride' in data)) throw new Error('Invalid status');
      const value = data.manualPhaseOverride;
      if (value !== null && value !== 'puzzle') throw new Error('Invalid override');
      if (Date.now() >= localWriteUntilRef.current) setManualOverride(value);
    } catch {
      // The published schedule remains the safe fallback when remote state cannot be read.
      if (Date.now() >= localWriteUntilRef.current) setManualOverride(null);
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);
  useEffect(() => {
    void refreshOverride();
    const interval = window.setInterval(() => { void refreshOverride(); }, 30000);
    const onFocus = () => { void refreshOverride(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') void refreshOverride(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refreshOverride]);
  const [solved, setSolved] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === SESSION_REVISION; } catch { return false; }
  });
  const markSolved = useCallback(() => {
    if (!canSolveAt(Date.now(), isDevPreview, manualOverride)) return;
    setSolved(true);
    try { sessionStorage.setItem(SESSION_KEY, SESSION_REVISION); } catch { /* In-memory unlock still works. */ }
  }, [isDevPreview, manualOverride]);
  const reset = useCallback(() => {
    setSolved(false);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Storage can be unavailable. */ }
  }, []);
  const phase = getPhaseForWindow(scheduleWindow, eventConfig.eventPhase, isDevPreview, solved, manualOverride);
  const puzzleActive = phase === 'puzzle' || phase === 'problem-unlocked';
  const challengeOpen = manualOverride === 'puzzle' || scheduleWindow === 'live' || (scheduleWindow === 'upcoming' && isDevPreview);
  return <EventContext.Provider value={{
    phase, isDevPreview, accessGranted: puzzleActive && solved, hasSolvedPuzzle: solved, challengeOpen, manualOverride,
    applyManualOverride,
    puzzle: puzzleActive ? eventConfig.puzzle : null,
    markSolved, reset,
  }}>{children}</EventContext.Provider>;
}

export function useEventRuntime() {
  const value = useContext(EventContext);
  if (!value) throw new Error('Event components require EventProvider.');
  return value;
}
