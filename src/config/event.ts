import { eventSchedule } from './schedule';

export const eventPhases = ['teaser', 'puzzle', 'problem-unlocked', 'submission', 'closed'] as const;
export type EventPhase = (typeof eventPhases)[number];
export type PuzzleContent = {
  ciphertext: string;
  protocolTitle: string;
  instructions: string;
  settings: readonly { label: string; value: string }[];
};

export type Domain = { id: string; name: string; description?: string };

type EventConfig = {
  eventPhase: EventPhase;
  registrationUrl: string;
  whatsappUrl: string;
  submissionUrl: string | null;
  /** ISO 8601 date/time with explicit timezone, e.g. a Z or +05:30 suffix. */
  submissionDeadline: string | null;
  puzzle: PuzzleContent | null;
  domains: readonly Domain[];
};

// Browser-delivered configuration is inspectable. Never put answer-bearing secrets here.
export const eventConfig: EventConfig = {
  eventPhase: 'teaser',
  // LAUNCH BLOCKER: replace this placeholder with the real initial registration form.
  registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd19CzZZ30af_LDPY54VTQPymOe7A_tALptnVRXTBgC6MFTYA/viewform',
  // Verify the invitation in WhatsApp before publishing; syntax alone cannot confirm it is active.
  whatsappUrl: 'https://chat.whatsapp.com/IlVGvqCeiSN7LM8VBNl43n',
  // LAUNCH BLOCKER: add the second-stage PPT form separately; never reuse initial registration.
  submissionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdG48YxOZh6ZK9DNZx3a44zI1bTS-SC1-3zbAoEHXdhEIGCmQ/viewform',
  submissionDeadline: eventSchedule.submissionDeadline,
  puzzle: null,
  // Add confirmed event Domains here. Never ship test Domains to participants.
  domains: [],
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

export function getSubmissionUrl(): string | null {
  const url = getPublicEventUrl(eventConfig.submissionUrl);
  const deadline = eventConfig.submissionDeadline;
  if (!url || url === getPublicEventUrl(eventConfig.registrationUrl) || !deadline || !/T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(deadline) || !Number.isFinite(Date.parse(deadline))) return null;
  return url;
}

export const timelineMilestones = [
  { number: '01', name: 'Registration', note: 'Teams are welcome' },
  { number: '02', name: 'Decoding Challenge', note: 'Decode to access the Domains' },
  { number: '03', name: 'Domains', note: 'Choose your system' },
  { number: '04', name: 'PPT Submission', note: 'Show your process' },
  { number: '05', name: 'Shortlisting', note: 'Final review' },
  { number: '06', name: 'Presentations', note: 'Present your prototype' },
  { number: '07', name: 'Winner Announcement', note: 'Final result' },
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
      label: 'DOMAINS',
      status: 'PHASE 00 / PREPARING',
      headline: 'COMING SOON',
      description: 'The Domains are being prepared. Get registered and stay close for the unlock.',
      pendingRegistrationDescription: 'The Domains are being prepared. Registration details will follow; stay close for the unlock.',
      plateCaption: 'OBJECTIVE / AWAITING RELEASE',
    },
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the Domains' },
    currentMilestone: 0,
  },
  puzzle: {
    headerLabel: 'EVENT / PUZZLE',
    challenge: {
      label: 'DECODING CHALLENGE',
      status: 'PHASE 01 / LIVE',
      headline: 'ENIGMA PROTOCOL',
      description: 'Solve the decoding challenge to unlock the Domains.',
      plateCaption: 'OBJECTIVE / DECODE',
    },
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the Domains' },
    currentMilestone: 1,
  },
  'problem-unlocked': {
    headerLabel: 'EVENT / DOMAINS UNLOCKED',
    challenge: {
      label: 'DOMAINS',
      status: 'PHASE 02 / UNLOCKED',
      headline: 'ACCESS GRANTED',
      description: 'The Domains become available after the decoding challenge is solved.',
      plateCaption: 'OBJECTIVE / UNLOCKED',
    },
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the Domains' },
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
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the Domains' },
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
    challengeMilestone: { name: 'Decoding Challenge', note: 'Decode to access the Domains' },
    currentMilestone: null,
  },
};
