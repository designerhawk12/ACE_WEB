const milestones = [
  { number: '01', name: 'Registration Open', note: 'Teams are welcome', state: 'OPEN', current: true },
  { number: '02', name: 'Challenge Unlock', note: 'The brief goes live', state: 'UP NEXT' },
  { number: '03', name: 'Problem Statements', note: 'Choose your system', state: 'SOON' },
  { number: '04', name: 'PPT Submission', note: 'Show your process', state: 'PENDING' },
  { number: '05', name: 'Shortlisting', note: 'Final review', state: 'PENDING' },
] as const;

export function EventTimeline() {
  return (
    <section className="timeline section-rule" id="timeline" aria-labelledby="timeline-title">
      <div className="timeline__intro">
        <div className="section-index">
          <span className="index-number">04</span>
          <span className="index-line" aria-hidden="true" />
          <span className="eyebrow">SEQUENCE / STATUS</span>
        </div>
        <h2 id="timeline-title">A process,<br /><em>in five parts.</em></h2>
        <p>The order of operations. The next marker appears when it is time.</p>
      </div>

      <ol className="timeline__list">
        {milestones.map((item) => (
          <li className={`timeline__item${'current' in item && item.current ? ' is-current' : ''}`} key={item.number}>
            <span className="timeline__number">{item.number}</span>
            <div className="timeline__copy">
              <h3>{item.name}</h3>
              <p>{item.note}</p>
            </div>
            <span className="timeline__state">{item.state}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
