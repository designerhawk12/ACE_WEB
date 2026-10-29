import { eventConfig, getPublicEventUrl, timelineMilestones } from '../config/event';

export function EventTimeline() {
  const registrationPending = !getPublicEventUrl(eventConfig.registrationUrl);

  return (
    <section className="timeline section-rule" id="timeline" aria-labelledby="timeline-title">
      <div className="timeline__intro">
        <div className="section-index">
          <span className="index-number">02</span>
          <span className="index-line" aria-hidden="true" />
          <span className="eyebrow">SEQUENCE / STATUS</span>
        </div>
        <h2 id="timeline-title">A process,<br /><em>in four stages.</em></h2>
        <p>From the first registration to a live prototype presentation.</p>
      </div>

      <ol className="timeline__list">
        <li className="timeline__progress" aria-hidden="true" />
        {timelineMilestones.map((item, index) => {
          return (
            <li className="timeline__item" key={item.number}>
              <span className="timeline__number">{item.number}</span>
              <div className="timeline__copy">
                <h3>{item.name}</h3>
                <p>{index === 0 && registrationPending ? 'Registration link to follow.' : item.note}</p>
                <ul className="timeline__details">{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
              </div>
              <span className="timeline__state">{index === 0 && registrationPending ? 'LINK PENDING' : item.state}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
