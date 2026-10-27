import { useState, type FormEvent, type RefObject } from 'react';
import type { PuzzleContent } from '../config/event';

type PuzzleChallengeProps = {
  content: PuzzleContent;
  feedback: string;
  attempts: number;
  locked: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onSubmitAnswer: (answer: string) => void;
};

export function PuzzleChallenge({ content, feedback, attempts, locked, inputRef, onSubmitAnswer }: PuzzleChallengeProps) {
  const [answer, setAnswer] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answer.trim() && !locked) {
      onSubmitAnswer(answer);
      setAnswer('');
    }
  };
  return <div className="puzzle-challenge">
    <header className="puzzle-challenge__heading">
      <p className="eyebrow">01 / HUMAN CHECK</p>
      <h2 id="challenge-title">THE HUMAN<br />TEST</h2>
      <div className="puzzle-challenge__intro">
        {content.intro.map(line => <p key={line}>{line}</p>)}
        <p className="puzzle-challenge__support">{content.supportingLine}</p>
      </div>
    </header>
    <div className="puzzle-challenge__workspace">
      <p className="eyebrow">QUICK CHECK / 001</p>
      <p className="puzzle-challenge__question">{content.question}</p>
      <form className="puzzle-challenge__form" onSubmit={submit} aria-busy={locked}>
        <label className="eyebrow" htmlFor="puzzle-answer">YOUR ANSWER</label>
        <div className="puzzle-challenge__input-row">
          <input ref={inputRef} id="puzzle-answer" value={answer} onChange={event => setAnswer(event.target.value)} disabled={locked} autoComplete="off" inputMode="numeric" spellCheck={false} maxLength={12} aria-describedby="puzzle-feedback" enterKeyHint="go" type="text" />
          <button type="submit" disabled={locked || !answer.trim()}>CHECK ANSWER <span aria-hidden="true">→</span></button>
        </div>
        <p className="puzzle-challenge__feedback" id="puzzle-feedback" role="status" aria-live="polite" aria-atomic="true">{feedback}{attempts > 0 && <span className="puzzle-challenge__attempt">ATTEMPT {attempts} / 3</span>}</p>
      </form>
    </div>
  </div>;
}
