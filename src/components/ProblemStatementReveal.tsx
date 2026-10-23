import type { ProblemStatement } from '../config/event';

export function ProblemStatementReveal({ statement }: { statement: ProblemStatement }) {
  return (
    <section className="problem-reveal section-rule page-gutter" aria-labelledby="problem-reveal-title">
      <p className="eyebrow challenge__kicker">PROBLEM STATEMENT / UNLOCKED</p>
      <h2 id="problem-reveal-title">{statement.title}</h2>
      <p>{statement.brief}</p>
      <div className="problem-reveal__rules">
        <h3>PROBLEM-SOLVING PROTOCOL</h3>
        <ol>{statement.rules.map((rule, index) => <li key={`${index}-${rule}`}>{rule}</li>)}</ol>
      </div>
    </section>
  );
}
