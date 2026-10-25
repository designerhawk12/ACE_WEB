import { useState, type FormEvent, type RefObject } from 'react';
import type { PuzzleContent } from '../config/event';
import { PuzzleRules } from './PuzzleRules';

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
    if (answer.trim() && !locked) onSubmitAnswer(answer);
  };
  return <div className="puzzle-challenge">
    <header className="puzzle-challenge__heading">
      <p className="eyebrow">DECODING CHALLENGE</p>
      <h2 id="challenge-title">ENIGMA<br />PROTOCOL</h2>
      <p className="puzzle-challenge__message">ONE MESSAGE. ONE MACHINE. ONE CONFIGURATION.</p>
    </header>
    <div className="puzzle-challenge__workspace">
      <div className="puzzle-cipher" aria-label="Encrypted message">
        <span className="eyebrow">CIPHERTEXT / 001</span>
        <p>{content.ciphertext}</p>
      </div>
      <form className="puzzle-challenge__form" onSubmit={submit} aria-busy={locked}>
        <label className="eyebrow" htmlFor="puzzle-answer">RECONSTRUCTED PHRASE</label>
        <div className="puzzle-challenge__input-row">
          <input ref={inputRef} id="puzzle-answer" value={answer} onChange={event => setAnswer(event.target.value)} disabled={locked} autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={100} aria-describedby="puzzle-feedback" enterKeyHint="go" type="text" />
          <button type="submit" disabled={locked || !answer.trim()}>DECODE <span aria-hidden="true">→</span></button>
        </div>
        <p className="puzzle-challenge__feedback" id="puzzle-feedback" role="status" aria-atomic="true"><span key={`${attempts}-${feedback}`}>{feedback}{attempts > 0 && <span className="sr-only"> Attempt {attempts}.</span>}</span></p>
      </form>
      <PuzzleRules content={content} />
    </div>
  </div>;
}
