import { useState, type FormEvent } from 'react';
import type { PuzzleContent } from '../config/event';
import { PuzzleRules } from './PuzzleRules';

type PuzzleChallengeProps = {
  content: PuzzleContent;
  feedback?: string;
  onSubmitAnswer?: (answer: string) => void;
};

// Presentation and input only. A future verifier must supply onSubmitAnswer.
export function PuzzleChallenge({ content, feedback, onSubmitAnswer }: PuzzleChallengeProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmitAnswer && answer.trim()) onSubmitAnswer(answer.trim());
  };

  return (
    <section className="challenge section-rule puzzle-challenge" id="challenge" aria-labelledby="challenge-title">
      <div className="section-index">
        <span className="index-number">02</span>
        <span className="index-line" aria-hidden="true" />
        <span className="eyebrow">CURRENT CHALLENGE STATUS</span>
      </div>
      <div className="challenge__layout">
        <div className="challenge__heading">
          <p className="eyebrow challenge__kicker">DECODING CHALLENGE</p>
          <h2 id="challenge-title">DECODE THE SIGNAL</h2>
          <div className="puzzle-challenge__signal" aria-label="Scrambled message">
            {content.scrambledLines.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
          </div>
          <form className="puzzle-challenge__form" onSubmit={handleSubmit}>
            <label className="eyebrow" htmlFor="puzzle-answer">YOUR ANSWER</label>
            <div className="puzzle-challenge__input-row">
              <input
                autoComplete="off"
                disabled={!onSubmitAnswer}
                id="puzzle-answer"
                onChange={(event) => setAnswer(event.target.value)}
                spellCheck={false}
                type="text"
                value={answer}
              />
              <button disabled={!onSubmitAnswer || !answer.trim()} type="submit">SUBMIT →</button>
            </div>
            <p className="puzzle-challenge__feedback" aria-live="polite">{feedback ?? ''}</p>
          </form>
        </div>
        <PuzzleRules rules={content.rules} />
      </div>
    </section>
  );
}
