import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PuzzleContent } from '../config/event';

type PuzzleRulesProps = {
  content: PuzzleContent;
};

export function PuzzleRules({ content }: PuzzleRulesProps) {
  return (
    <details className="puzzle-rules" open onToggle={() => ScrollTrigger.refresh()}>
      <summary>PROTOCOL / RULES <span aria-hidden="true">+</span></summary>
      <div className="puzzle-rules__content" lang="ja">
        <h3>{content.protocolTitle}</h3>
        <p>{content.instructions}</p>
        <dl className="puzzle-rules__settings">
          {content.settings.map(setting => <div key={setting.label}><dt>{setting.label}：</dt><dd>{setting.value}</dd></div>)}
        </dl>
      </div>
    </details>
  );
}
