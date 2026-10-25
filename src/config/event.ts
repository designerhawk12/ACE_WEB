import { eventSchedule } from './schedule';

export const eventPhases = ['teaser', 'puzzle', 'problem-unlocked', 'submission', 'closed'] as const;
export type EventPhase = (typeof eventPhases)[number];
export type PuzzleContent = {
  ciphertext: string;
  protocolTitle: string;
  instructions: string;
  settings: readonly { label: string; value: string }[];
};

export type ProblemStatement = {
  title: string;
  brief: string;
  rules: readonly string[];
};

type EventConfig = {
  eventPhase: EventPhase;
  registrationUrl: string;
  whatsappUrl: string;
  submissionUrl: string | null;
  /** ISO 8601 date/time with explicit timezone, e.g. a Z or +05:30 suffix. */
  submissionDeadline: string | null;
  puzzle: PuzzleContent | null;
  problemStatement: ProblemStatement | null;
};

// Browser-delivered configuration is inspectable. Never put answer-bearing secrets here.
export const eventConfig: EventConfig = {
  eventPhase: 'teaser',
  // LAUNCH BLOCKER: replace both placeholders with the real public URLs before publishing.
  registrationUrl: 'https://example.com/register',
  whatsappUrl: 'https://chat.whatsapp.com/IlVGvqCeiSN7LM8VBNl43n',
  // Second-stage final submission. Supply its URL separately; never reuse initial registration.
  submissionUrl: null,
  submissionDeadline: eventSchedule.submissionDeadline,
  puzzle: null,
  problemStatement: null,
};

export function getPublicEventUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    if (url.hostname === 'example.com' || url.hostname.endsWith('.example.com')) return null;
    if (/placeholder|replace[-_]?me/i.test(url.pathname + url.search)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export const timelineMilestones = [
  { number: '01', name: 'Registration', note: 'Teams are welcome' },
  { number: '02', name: 'Decoding Challenge', note: 'Decode to access the brief' },
  { number: '03', name: 'Problem Statements', note: 'Choose your system' },
  { number: '04', name: 'PPT Submission', note: 'Show your process' },
  { number: '05', name: 'Shortlisting', note: 'Final review' },
] as const;

type PhasePresentation = {
  headerLabel: string;
  challenge: {
    label: string;
    status: string;
    headline: string;
    description: string;
    pendingRegistrationDescription?: string;
    plateCaption: string;
  };
  challengeMilestone: { name: string; note: string };
  currentMilestone: number | null;
};

export const phasePresentation: Record<EventPhase, PhasePresentation> = {
  teaser: {
    headerLabel: 'EVENT / TEASER',
    challenge: {
      label: 'PROBLEM STATEMENTS',
      status: 'PHASE 00 / PREPARING',
      headline: 'COMING SOON',
      description: 'The brief is being prepared. Get registered and stay close for the unlock.',
      pendingRegistrationDescription: 'The brief is being prepared. Registration details will follow; stay close for the unlock.',
      plateCaption: 'OBJECTIVE / AWAITING RELEASE',
    },
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the brief' },
    currentMilestone: 0,
  },
  puzzle: {
    headerLabel: 'EVENT / PUZZLE',
    challenge: {
      label: 'DECODING CHALLENGE',
      status: 'PHASE 01 / LIVE',
      headline: 'ENIGMA PROTOCOL',
      description: 'A decoding challenge stands between you and the brief.',
      plateCaption: 'OBJECTIVE / DECODE',
    },
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the brief' },
    currentMilestone: 1,
  },
  'problem-unlocked': {
    headerLabel: 'EVENT / BRIEF UNLOCKED',
    challenge: {
      label: 'PROBLEM STATEMENTS',
      status: 'PHASE 02 / UNLOCKED',
      headline: 'ACCESS GRANTED',
      description: 'The brief becomes available after the decoding challenge is solved.',
      plateCaption: 'OBJECTIVE / UNLOCKED',
    },
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the brief' },
    currentMilestone: 2,
  },
  submission: {
    headerLabel: 'EVENT / SUBMISSION',
    challenge: {
      label: 'PPT SUBMISSION',
      status: 'PHASE 03 / SUBMISSIONS OPEN',
      headline: 'SHOW YOUR WORK',
      description: 'Package your process, evidence, and findings for review.',
      plateCaption: 'OBJECTIVE / SUBMIT',
    },
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the brief' },
    currentMilestone: 3,
  },
  closed: {
    headerLabel: 'EVENT / CLOSED',
    challenge: {
      label: 'DECODING CHALLENGE',
      status: 'ARCHIVE / CLOSED',
      headline: 'CHALLENGE ENDED',
      description: 'The decoding window has closed. New answers are no longer accepted.',
      plateCaption: 'OBJECTIVE / COMPLETE',
    },
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the brief' },
    currentMilestone: null,
  },
};
