import { eventConfig, getPublicEventUrl, timelineMilestones } from '../config/event';

export function EventTimeline() {
  const registrationPending = !getPublicEventUrl(eventConfig.registrationUrl);
  const registrationNote = registrationPending ? 'Link to follow' : timelineMilestones[0].note;
  const statuses = [registrationPending ? 'LINK PENDING' : 'OPEN', 'AVAILABLE', 'AVAILABLE', 'PENDING', 'PENDING', 'PENDING'];

  return (
    <section className="timeline section-rule" id="timeline" aria-labelledby="timeline-title">
      <div className="timeline__intro">
        <div className="section-index">
          <span className="index-number">02</span>
          <span className="index-line" aria-hidden="true" />
          <span className="eyebrow">SEQUENCE / STATUS</span>
        </div>
        <h2 id="timeline-title">A process,<br /><em>in six parts.</em></h2>
        <p>The order of operations, from registration through final results.</p>
      </div>

      <ol className="timeline__list">
        <li className="timeline__progress" aria-hidden="true" />
        {timelineMilestones.map((item, index) => {
          const name = item.name;
          const note = index === 0 ? registrationNote : item.note;

          return (
            <li className="timeline__item" key={item.number}>
              <span className="timeline__number">{item.number}</span>
              <div className="timeline__copy">
                <h3>{name}</h3>
                <p>{note}</p>
              </div>
              <span className="timeline__state">{statuses[index]}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
