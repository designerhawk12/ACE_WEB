import { getSubmissionUrl } from '../config/event';

export function SubmissionAction({ floating = false }: { floating?: boolean }) {
  const url = getSubmissionUrl();
  const className = floating ? 'submission-float' : 'submission-action';
  const content = <><span>{floating ? 'SUBMIT PPT' : 'SUBMIT YOUR PPT'}</span><span aria-hidden="true">↗</span></>;
  if (url) return <a className={className} href={url} rel="noopener noreferrer" target="_blank">{content}</a>;
  return <button className={`${className} ${className}--pending`} type="button" disabled aria-label="Submit PPT — link pending" title="Link pending; check back soon">{content}</button>;
}
