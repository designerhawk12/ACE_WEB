export const EMERGENCY_TAPS = 10;
export const EMERGENCY_TAP_WINDOW_MS = 7000;

export type TapSequence = { count: number; startedAt: number };

// All ten presses must fit in one window; no visible UI or persisted state.
export function nextTap(sequence: TapSequence, now: number): { sequence: TapSequence; unlocked: boolean } {
  const active = sequence.count > 0 && now >= sequence.startedAt && now - sequence.startedAt <= EMERGENCY_TAP_WINDOW_MS;
  const count = active ? sequence.count + 1 : 1;
  return count >= EMERGENCY_TAPS
    ? { sequence: { count: 0, startedAt: 0 }, unlocked: true }
    : { sequence: { count, startedAt: active ? sequence.startedAt : now }, unlocked: false };
}
