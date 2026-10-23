type PuzzleRulesProps = {
  rules: readonly string[];
};

export function PuzzleRules({ rules }: PuzzleRulesProps) {
  return (
    <details className="puzzle-rules">
      <summary>PROTOCOL / RULES <span aria-hidden="true">+</span></summary>
      <ol>
        {rules.map((rule, index) => <li key={`${index}-${rule}`}>{rule}</li>)}
      </ol>
    </details>
  );
}
