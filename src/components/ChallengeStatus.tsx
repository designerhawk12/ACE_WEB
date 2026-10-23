import type { EventPhase } from '../config/event';

type PhaseCopy = {
  label: string;
  status: string;
  headline: string;
  description: string;
};

const phaseCopy: Record<EventPhase, PhaseCopy> = {
  teaser: {
    label: 'PROBLEM STATEMENTS',
    status: 'PHASE 00 / PREPARING',
    headline: 'COMING SOON',
    description: 'The brief is being prepared. Get registered and stay close for the unlock.',
  },
  quiz: {
    label: 'CHALLENGE QUIZ',
    status: 'PHASE 01 / LIVE',
    headline: 'THE CHALLENGE IS OPEN',
    description: 'The first round is live. Follow the event channel for challenge access.',
  },
  problems: {
    label: 'PROBLEM STATEMENTS',
    status: 'PHASE 02 / RELEASED',
    headline: 'THE BRIEF IS OPEN',
    description: 'Choose your subject, trace how it works, and document what you uncover.',
  },
  submission: {
    label: 'PPT SUBMISSION',
    status: 'PHASE 03 / SUBMISSIONS OPEN',
    headline: 'SHOW YOUR WORK',
    description: 'Package your process, evidence, and findings for review.',
  },
  closed: {
    label: 'EVENT STATUS',
    status: 'ARCHIVE / CLOSED',
    headline: 'THIS RUN IS COMPLETE',
    description: 'The challenge has concluded. Keep pulling at the threads.',
  },
};

type ChallengeStatusProps = {
  phase: EventPhase;
};

export function ChallengeStatus({ phase }: ChallengeStatusProps) {
  const content = phaseCopy[phase];

  return (
    <section className="challenge section-rule" id="challenge" aria-labelledby="challenge-title">
      <div className="section-index">
        <span className="index-number">02</span>
        <span className="index-line" aria-hidden="true" />
        <span className="eyebrow">CURRENT CHALLENGE STATUS</span>
      </div>

      <div className="challenge__layout">
        <div className="challenge__heading">
          <p className="eyebrow challenge__kicker">{content.label}</p>
          <h2 id="challenge-title">{content.headline}</h2>
          <p className="challenge__description">{content.description}</p>
        </div>

        <div className="challenge__plate" aria-label={`${content.label}: ${content.headline}`}>
          <div className="challenge__plate-top">
            <span>ACE / REVERSE ENGINEERING</span>
            <span className="plate-dot" aria-hidden="true" />
          </div>
          <div className="challenge__plate-center">
            <span className="challenge__crosshair" aria-hidden="true">+</span>
            <p>{content.status}</p>
            <span className="challenge__plate-title">{content.headline}</span>
            <span className="challenge__plate-caption">OBJECTIVE / AWAITING RELEASE</span>
          </div>
          <div className="challenge__plate-bottom">
            <span>R.E. / 001</span>
            <span>ACCESS // {phase.toUpperCase()}</span>
          </div>
          <span className="plate-corner plate-corner--tl" aria-hidden="true" />
          <span className="plate-corner plate-corner--br" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
