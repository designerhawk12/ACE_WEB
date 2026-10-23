import { eventConfig, getPublicEventUrl } from '../config/event';
import { useEventRuntime } from '../context/EventRuntime';

export function SubmissionNextSteps() {
  const { phase, accessGranted, statement } = useEventRuntime();
  if (phase !== 'submission' && !(phase === 'problem-unlocked' && accessGranted)) return null;

  const configuredUrl = getPublicEventUrl(eventConfig.submissionUrl);
  // An accidentally duplicated registration link must not become a submission action.
  const submissionUrl = configuredUrl !== getPublicEventUrl(eventConfig.registrationUrl) ? configuredUrl : null;
  const deadline = eventConfig.submissionDeadline;
  const date = deadline && /T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(deadline) ? new Date(deadline) : null;
  const deadlineLabel = date && !Number.isNaN(date.valueOf())
    ? `${new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(date)} IST`
    : null;
  const actionContent = <><span>SUBMIT YOUR PPT</span><span aria-hidden="true">↗</span></>;

  return <section className="submission-next" aria-labelledby="submission-next-title">
    <p className="eyebrow challenge__kicker">NEXT PROTOCOL / FINAL SUBMISSION</p>
    <h2 id="submission-next-title">Your next step:<br />submit your solution.</h2>
    <p>{statement
      ? 'You’ve unlocked the problem statement. Build your solution, prepare your PPT, and complete the final submission before the deadline.'
      : 'Review the problem statement when available, build your solution, prepare your PPT, and complete the final submission before the deadline.'}</p>
    <p className="submission-next__notice">This is a separate, second-stage submission. You must register/submit again through the final form. Your initial event registration does not submit your PPT.</p>
    <ol>
      <li>Review the unlocked problem statement and its problem-solving rules.</li>
      <li>Build your solution and prepare your PPT.</li>
      <li>Open the separate final submission form below.</li>
      <li>Enter the required participant/team details and selected problem statement in that form.</li>
      <li>Submit/upload your PPT in the form before the submission deadline.</li>
    </ol>
    <div className="submission-next__deadline">
      <span className="eyebrow">SUBMISSION DEADLINE</span>
      {deadlineLabel && deadline ? <time dateTime={deadline}>{deadlineLabel}</time> : <span>To be announced</span>}
    </div>
    {submissionUrl
      ? <a className="submission-action" href={submissionUrl} target="_blank" rel="noopener noreferrer">{actionContent}</a>
      : <button className="submission-action" type="button" disabled aria-label="Submit your PPT — submission link pending">{actionContent}</button>}
    {!submissionUrl && <p className="submission-next__pending">Final submission link pending. Check back for the form and deadline.</p>}
  </section>;
}
