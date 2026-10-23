import { eventConfig, getPublicEventUrl, phasePresentation, type EventPhase } from '../config/event';
import { EventClue } from './EventClue';

type ChallengeStatusProps = {
  phase: EventPhase;
};

export function ChallengeStatus({ phase }: ChallengeStatusProps) {
  const content = phasePresentation[phase].challenge;
  const description = phase === 'teaser' && !getPublicEventUrl(eventConfig.registrationUrl)
    ? content.pendingRegistrationDescription ?? content.description
    : content.description;

  return (
    <section className="challenge section-rule" id="challenge" aria-labelledby="challenge-title">
      <div className="challenge__reveal-rule" aria-hidden="true" />
      <div className="section-index">
        <span className="index-number">04</span>
        <span className="index-line" aria-hidden="true" />
        <span className="eyebrow">CURRENT CHALLENGE STATUS</span>
      </div>

      <div className="challenge__layout">
        <div className="challenge__heading">
          <p className="eyebrow challenge__kicker">{content.label}</p>
          <h2 id="challenge-title"><span className="challenge__headline">{content.headline}</span></h2>
          <EventClue slot="challenge" />
          <p className="challenge__description">{description}</p>
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
            <span className="challenge__plate-caption">{content.plateCaption}</span>
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
