import { eventConfig } from '../config/event';
import { PresentationDeckReference } from './PresentationDeckReference';

export function ParticipantGuide() {
  const domains = eventConfig.domains;

  return <div className="participant-guide">
    <section className="participant-guide__section" aria-labelledby="reverse-explained-title">
      <p className="eyebrow">01 / THE METHOD</p>
      <h3 id="reverse-explained-title">What is Reverse Engineering?</h3>
      <p>Reverse engineering means studying an existing product or software system to understand how it works: its functions, services, and behavior. You then recreate or improve a selected part without access to its original implementation.</p>
    </section>

    <section className="participant-guide__rule" aria-labelledby="eligibility-rule-title">
      <p className="eyebrow">02 / ELIGIBILITY</p>
      <h3 id="eligibility-rule-title">The rule<span>.</span></h3>
      <p>The application you choose must <strong>not be open source.</strong></p>
      <p>Choose any application within a provided Domain. Do not start from or reuse the application’s existing source code.</p>
    </section>

    <section className="participant-guide__section" aria-labelledby="participant-task-title">
      <p className="eyebrow">03 / THE WORK</p>
      <h3 id="participant-task-title">What you have to do</h3>
      <ol className="participant-guide__steps">
        <li><span>01</span><p>Choose an application that fits one of the Domains. It must not be open source.</p></li>
        <li><span>02</span><p>Study its function, service, workflow, behavior, and user experience. Select one existing feature to recreate.</p></li>
        <li><span>03</span><p>Build that feature yourself from scratch, without the original codebase. You do not need to recreate the entire application.</p></li>
        <li><span>04</span><p>Add something of your own: a useful improvement, missing feature, creative extension, or better workflow.</p></li>
        <li><span>05</span><p><strong>A functioning prototype is mandatory.</strong> It must demonstrate the recreated feature and your addition. An idea or static design alone is not enough.</p></li>
      </ol>
    </section>

    <section className="participant-guide__section" aria-labelledby="evaluation-title">
      <p className="eyebrow">04 / EVALUATION</p>
      <h3 id="evaluation-title">What the judges look for</h3>
      <p>Every registered team presents directly to the judges, with the working prototype at the center of the review.</p>
      <div className="participant-guide__criteria">
        <div><h4>CREATIVITY</h4><p>How thoughtful, original, and useful your addition is.</p></div>
        <div><h4>FUNCTIONALITY</h4><p>How well the working prototype performs.</p></div>
        <div><h4>USE CASE</h4><p>How meaningful the feature and your addition are in a real-world scenario.</p></div>
      </div>
    </section>

    <section className="participant-guide__section" aria-labelledby="domains-title">
      <p className="eyebrow">05 / CHOOSE YOUR DIRECTION</p>
      <h3 id="domains-title">Domains</h3>
      <p>Choose any application that falls within a Domain. You are not assigned a specific application; your choice must satisfy the non-open-source rule.</p>
      <ul className="participant-guide__domains">{domains.map((domain, index) => <li key={domain.id}><span className="participant-guide__domain-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h4>{domain.name}</h4>{domain.description && <p>{domain.description}</p>}</div></li>)}</ul>
    </section>

    <PresentationDeckReference />
  </div>;
}
