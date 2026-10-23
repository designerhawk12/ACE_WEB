export const eventPhases = ['teaser', 'puzzle', 'problem-unlocked', 'submission', 'closed'] as const;
export type EventPhase = (typeof eventPhases)[number];
export type ClueSlot = 'header' | 'hero' | 'about' | 'footer';

export type PuzzleContent = {
  scrambledLines: readonly string[];
  rules: readonly string[];
  clues: Partial<Record<ClueSlot, string>>;
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
  puzzle: PuzzleContent | null;
  problemStatement: ProblemStatement | null;
};

// Browser-delivered configuration is inspectable. Never put answer-bearing secrets here.
export const eventConfig: EventConfig = {
  eventPhase: 'teaser',
  // LAUNCH BLOCKER: replace both placeholders with the real public URLs before publishing.
  registrationUrl: 'https://example.com/register',
  whatsappUrl: 'https://chat.whatsapp.com/placeholder',
  puzzle: null,
  problemStatement: null,
};

export function getPublicEventUrl(value: string): string | null {
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
  { number: '01', name: 'Registration Open', note: 'Teams are welcome' },
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
  timelineStates: readonly [string, string, string, string, string];
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
    timelineStates: ['OPEN', 'UP NEXT', 'SOON', 'PENDING', 'PENDING'],
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the brief' },
    currentMilestone: 0,
  },
  puzzle: {
    headerLabel: 'EVENT / PUZZLE',
    challenge: {
      label: 'DECODING CHALLENGE',
      status: 'PHASE 01 / LIVE',
      headline: 'DECODE THE SIGNAL',
      description: 'A decoding challenge stands between you and the brief.',
      plateCaption: 'OBJECTIVE / DECODE',
    },
    timelineStates: ['OPEN', 'LIVE', 'LOCKED', 'PENDING', 'PENDING'],
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
    timelineStates: ['OPEN', 'COMPLETE', 'OPEN', 'UP NEXT', 'PENDING'],
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
    timelineStates: ['CLOSED', 'COMPLETE', 'COMPLETE', 'OPEN', 'UP NEXT'],
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the brief' },
    currentMilestone: 3,
  },
  closed: {
    headerLabel: 'EVENT / CLOSED',
    challenge: {
      label: 'EVENT STATUS',
      status: 'ARCHIVE / CLOSED',
      headline: 'THIS RUN IS COMPLETE',
      description: 'The challenge has concluded. Keep pulling at the threads.',
      plateCaption: 'OBJECTIVE / COMPLETE',
    },
    timelineStates: ['CLOSED', 'COMPLETE', 'COMPLETE', 'CLOSED', 'COMPLETE'],
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the brief' },
    currentMilestone: null,
  },
};
