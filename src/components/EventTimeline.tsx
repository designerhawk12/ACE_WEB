import { eventConfig, getPublicEventUrl, phasePresentation, timelineMilestones, type EventPhase } from '../config/event';

export function EventTimeline({ phase }: { phase: EventPhase }) {
  const { timelineStates, challengeMilestone, currentMilestone } = phasePresentation[phase];
  const registrationPending = !getPublicEventUrl(eventConfig.registrationUrl);

  return (
    <section className="timeline section-rule" id="timeline" aria-labelledby="timeline-title">
      <div className="timeline__intro">
        <div className="section-index">
          <span className="index-number">02</span>
          <span className="index-line" aria-hidden="true" />
          <span className="eyebrow">SEQUENCE / STATUS</span>
        </div>
        <h2 id="timeline-title">A process,<br /><em>in five parts.</em></h2>
        <p>The order of operations. The next marker appears when it is time.</p>
      </div>

      <ol className="timeline__list">
        <li className="timeline__progress" aria-hidden="true" />
        {timelineMilestones.map((item, index) => {
          const pendingRegistration = index === 0 && registrationPending;
          const name = pendingRegistration ? 'Registration Pending' : index === 1 ? challengeMilestone.name : item.name;
          const note = pendingRegistration ? 'Link to follow' : index === 1 ? challengeMilestone.note : item.note;

          return (
            <li className={`timeline__item${currentMilestone === index && !pendingRegistration ? ' is-current' : ''}`} key={item.number}>
              <span className="timeline__number">{item.number}</span>
              <div className="timeline__copy">
                <h3>{name}</h3>
                <p>{note}</p>
              </div>
              <span className="timeline__state">{pendingRegistration ? 'PENDING' : timelineStates[index]}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
