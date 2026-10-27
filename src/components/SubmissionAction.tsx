import { useId, useRef } from 'react';
import { getSubmissionUrl } from '../config/event';
import { isSubmissionOpenAt } from '../config/schedule';
import { useEventRuntime } from '../context/EventRuntime';
import { useScheduleWindow, useSubmissionOpen } from '../hooks/useEventClock';

export function SubmissionAction({ floating = false }: { floating?: boolean }) {
  const { hasSolvedPuzzle, challengeOpen, phase } = useEventRuntime();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();
  const open = useSubmissionOpen();
  const scheduleWindow = useScheduleWindow();
  const url = getSubmissionUrl();
  const className = floating ? 'submission-float' : 'submission-action';
  const content = <><span>{floating ? 'SUBMIT PPT' : 'SUBMIT YOUR PPT'}</span><span aria-hidden="true">↗</span></>;
  if (open && url && hasSolvedPuzzle) return <a className={className} href={url} onClick={event => { if (!isSubmissionOpenAt(Date.now())) event.preventDefault(); }} rel="noopener noreferrer" target="_blank">{content}</a>;
  if (open && url) return <>
    <button className={className} type="button" onClick={() => dialogRef.current?.showModal()}>{content}</button>
    <dialog className="submission-gate" ref={dialogRef} aria-labelledby={`${dialogId}-title`} aria-describedby={`${dialogId}-description`}>
      <p className="eyebrow">ACE / SUBMISSION ACCESS</p>
      <h2 id={`${dialogId}-title`}>Take the Human Test first<span>.</span></h2>
      <p id={`${dialogId}-description`}>Complete the quick check to unlock PPT submission.</p>
      <div className="submission-gate__actions">
        {challengeOpen && (phase === 'puzzle' || phase === 'problem-unlocked') && <a href="#challenge" onClick={() => {
          dialogRef.current?.close();
          window.requestAnimationFrame(() => document.getElementById('puzzle-answer')?.focus({ preventScroll: true }));
        }}>GO TO HUMAN TEST <span aria-hidden="true">↗</span></a>}
        <button type="button" onClick={() => dialogRef.current?.close()}>CLOSE</button>
      </div>
    </dialog>
  </>;
  const pending = open ? 'submission form pending' : scheduleWindow === 'upcoming' ? 'submission not open yet' : 'submissions ended';
  return <button className={`${className} ${className}--pending`} type="button" disabled aria-label={`Submit PPT — ${pending}`} title={pending}>{content}</button>;
}
