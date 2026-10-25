import { getSubmissionUrl } from '../config/event';
import { isSubmissionOpenAt } from '../config/schedule';
import { useScheduleWindow, useSubmissionOpen } from '../hooks/useEventClock';

export function SubmissionAction({ floating = false }: { floating?: boolean }) {
  const open = useSubmissionOpen();
  const window = useScheduleWindow();
  const url = getSubmissionUrl();
  const className = floating ? 'submission-float' : 'submission-action';
  const content = <><span>{floating ? 'SUBMIT PPT' : 'SUBMIT YOUR PPT'}</span><span aria-hidden="true">↗</span></>;
  if (open && url) return <a className={className} href={url} onClick={event => { if (!isSubmissionOpenAt(Date.now())) event.preventDefault(); }} rel="noopener noreferrer" target="_blank">{content}</a>;
  const pending = open ? 'submission form pending' : window === 'upcoming' ? 'submission not open yet' : 'submissions ended';
  return <button className={`${className} ${className}--pending`} type="button" disabled aria-label={`Submit PPT — ${pending}`} title={pending}>{content}</button>;
}
