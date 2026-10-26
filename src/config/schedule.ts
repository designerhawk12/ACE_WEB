import type { EventPhase } from './event';

const release = '2026-10-27T09:00:00+05:30';
const deadline = '2026-10-29T18:30:00+05:30';

export const eventSchedule = {
  challengeStart: release,
  challengeEnd: deadline,
  registrationEnd: deadline,
  problemStatementsStart: release,
  problemStatementsEnd: deadline,
  submissionStart: release,
  submissionDeadline: deadline,
} as const;

export const eventTimes = {
  challengeStart: Date.parse(eventSchedule.challengeStart),
  challengeEnd: Date.parse(eventSchedule.challengeEnd),
  registrationEnd: Date.parse(eventSchedule.registrationEnd),
  problemStatementsStart: Date.parse(eventSchedule.problemStatementsStart),
  problemStatementsEnd: Date.parse(eventSchedule.problemStatementsEnd),
  submissionStart: Date.parse(eventSchedule.submissionStart),
  submissionDeadline: Date.parse(eventSchedule.submissionDeadline),
} as const;

export type ScheduleWindow = 'upcoming' | 'live' | 'ended';
export type ManualPhaseOverride = 'puzzle' | null;
export type CountdownKind = 'registration' | 'challenge' | 'statements' | 'submission';

export function getScheduleWindow(now: number): ScheduleWindow {
  if (now < eventTimes.challengeStart) return 'upcoming';
  if (now < eventTimes.challengeEnd) return 'live';
  return 'ended';
}

export function getEffectivePhase(now: number, baseline: EventPhase, isDevPreview: boolean, solved: boolean, manualOverride: ManualPhaseOverride = null): EventPhase {
  return getPhaseForWindow(getScheduleWindow(now), baseline, isDevPreview, solved, manualOverride);
}

export function getPhaseForWindow(window: ScheduleWindow, baseline: EventPhase, isDevPreview: boolean, solved: boolean, manualOverride: ManualPhaseOverride = null): EventPhase {
  if (manualOverride === 'puzzle') return solved ? 'problem-unlocked' : 'puzzle';
  if (baseline === 'submission' || baseline === 'closed') return baseline;
  if (window === 'upcoming' && !isDevPreview) return 'teaser';
  if (solved) return 'problem-unlocked';
  return window === 'ended' ? 'closed' : 'puzzle';
}

export function canSolveAt(now: number, isDevPreview: boolean, manualOverride: ManualPhaseOverride = null): boolean {
  return manualOverride === 'puzzle' || (now < eventTimes.challengeEnd && (isDevPreview || now >= eventTimes.challengeStart));
}

export function isRegistrationOpenAt(now: number): boolean {
  return now < eventTimes.registrationEnd;
}

export function isSubmissionOpenAt(now: number): boolean {
  return now >= eventTimes.submissionStart && now < eventTimes.submissionDeadline;
}

export function formatCountdown(target: number, now: number): string {
  const seconds = Math.max(0, Math.ceil((target - now) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return `${String(hours).padStart(2, '0')}HR ${String(minutes).padStart(2, '0')}MIN ${String(remainder).padStart(2, '0')}SEC`;
}

export function formatIstDate(timestamp: string): string {
  return `${new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(timestamp))} IST`;
}

export function getCountdown(kind: CountdownKind, now: number): { label: string; value: string | null } {
  if (kind === 'registration') {
    return now < eventTimes.registrationEnd
      ? { label: 'REGISTRATION CLOSES IN', value: formatCountdown(eventTimes.registrationEnd, now) }
      : { label: 'REGISTRATIONS ENDED', value: null };
  }
  const [start, end] = kind === 'challenge'
    ? [eventTimes.challengeStart, eventTimes.challengeEnd]
    : kind === 'statements'
      ? [eventTimes.problemStatementsStart, eventTimes.problemStatementsEnd]
      : [eventTimes.submissionStart, eventTimes.submissionDeadline];
  if (now < start) return { label: 'STARTS IN', value: formatCountdown(start, now) };
  if (now < end) return { label: 'ENDS IN', value: formatCountdown(end, now) };
  return { label: 'ENDED', value: null };
}
