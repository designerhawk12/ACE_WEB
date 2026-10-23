import { ScrollTrigger } from 'gsap/ScrollTrigger';

type PuzzleRulesProps = {
  rules: readonly string[];
};

export function PuzzleRules({ rules }: PuzzleRulesProps) {
  return (
    <details className="puzzle-rules" onToggle={() => ScrollTrigger.refresh()}>
      <summary>PROTOCOL / RULES <span aria-hidden="true">+</span></summary>
      <ol>
        {rules.map((rule, index) => <li key={`${index}-${rule}`}>{rule.split(/(起点|終点|二・三)/g).map((part, partIndex) => /^(起点|終点|二・三)$/.test(part) ? <span key={partIndex} lang="ja">{part}</span> : part)}</li>)}
      </ol>
      <dl className="puzzle-rules__numerals" aria-label="Japanese numeral key">
        {[['一', '1'], ['二', '2'], ['三', '3'], ['四', '4']].map(([symbol, numeral]) => <div key={symbol}><dt lang="ja">{symbol}</dt><dd>= {numeral}</dd></div>)}
      </dl>
    </details>
  );
}
