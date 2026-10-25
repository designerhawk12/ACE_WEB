import { eventConfig, getPublicEventUrl, phasePresentation, timelineMilestones, type EventPhase } from '../config/event';
import { ScheduleReadout } from './ScheduleReadout';
import { useRegistrationOpen } from '../hooks/useEventClock';

export function EventTimeline({ phase }: { phase: EventPhase }) {
  const { challengeMilestone, currentMilestone } = phasePresentation[phase];
  const registrationPending = !getPublicEventUrl(eventConfig.registrationUrl);
  const registrationOpen = useRegistrationOpen();
  const registrationNote = !registrationOpen ? 'Registration closed' : registrationPending ? 'Link to follow' : timelineMilestones[0].note;

  return (
    <section className="timeline section-rule" id="timeline" aria-labelledby="timeline-title">
      <div className="timeline__intro">
        <div className="section-index">
          <span className="index-number">02</span>
          <span className="index-line" aria-hidden="true" />
          <span className="eyebrow">SEQUENCE / STATUS</span>
        </div>
        <h2 id="timeline-title">A process,<br /><em>in seven parts.</em></h2>
        <p>The order of operations. The next marker appears when it is time.</p>
      </div>

      <ol className="timeline__list">
        <li className="timeline__progress" aria-hidden="true" />
        {timelineMilestones.map((item, index) => {
          const name = index === 1 ? challengeMilestone.name : item.name;
          const note = index === 0 ? registrationNote : index === 1 ? challengeMilestone.note : item.note;

          return (
            <li className={`timeline__item${currentMilestone === index && !(index === 0 && registrationPending) ? ' is-current' : ''}`} key={item.number}>
              <span className="timeline__number">{item.number}</span>
              <div className="timeline__copy">
                <h3>{name}</h3>
                <p>{note}</p>
              </div>
              {index < 4
                ? <ScheduleReadout className="timeline__state" kind={(['registration', 'challenge', 'statements', 'submission'] as const)[index]} />
                : <span className="timeline__state">{index === 5 ? 'STARTS ON 30TH OCTOBER' : 'PENDING'}</span>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
