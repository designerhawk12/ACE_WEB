import { eventConfig, getPublicEventUrl } from '../config/event';
import { useEventRuntime } from '../context/EventRuntime';
import { formatIstDate, isSubmissionOpenAt } from '../config/schedule';
import { useScheduleWindow, useSubmissionOpen } from '../hooks/useEventClock';

export function SubmissionNextSteps() {
  const { phase, accessGranted, statement } = useEventRuntime();
  const scheduleWindow = useScheduleWindow();
  const submissionOpen = useSubmissionOpen();
  if (phase !== 'submission' && !(phase === 'problem-unlocked' && accessGranted)) return null;

  const configuredUrl = getPublicEventUrl(eventConfig.submissionUrl);
  const deadline = eventConfig.submissionDeadline;
  const date = deadline && /T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(deadline) ? new Date(deadline) : null;
  const deadlineLabel = date && !Number.isNaN(date.valueOf()) && deadline ? formatIstDate(deadline) : null;
  // A missing deadline or duplicated registration link must not become a submission action.
  const submissionUrl = deadlineLabel && configuredUrl !== getPublicEventUrl(eventConfig.registrationUrl) ? configuredUrl : null;
  const actionContent = <><span>SUBMIT YOUR PPT</span><span aria-hidden="true">↗</span></>;

  return <section className="submission-next" aria-labelledby="submission-next-title">
    <p className="eyebrow challenge__kicker">NEXT PROTOCOL / FINAL SUBMISSION</p>
    <h2 id="submission-next-title">Your next step:<br />submit your solution.</h2>
    <p>{scheduleWindow === 'ended'
      ? 'The final submission window has closed. Your unlocked brief remains available for reference.'
      : statement
      ? 'You’ve unlocked the problem statement. Build your solution, prepare your PPT, and complete the final submission before the deadline.'
      : 'Review the problem statement when available, build your solution, prepare your PPT, and complete the final submission before the deadline.'}</p>
    <p className="submission-next__notice">{scheduleWindow === 'ended'
      ? 'Initial event registration and final PPT submission were separate actions. The final form is now closed.'
      : 'This is a separate, second-stage submission. You must register/submit again through the final form. Your initial event registration does not submit your PPT.'}</p>
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
      {scheduleWindow === 'ended' && <strong className="submission-next__ended">SUBMISSIONS ENDED</strong>}
    </div>
    {submissionUrl && submissionOpen
      ? <a className="submission-action" href={submissionUrl} onClick={event => { if (!isSubmissionOpenAt(Date.now())) event.preventDefault(); }} target="_blank" rel="noopener noreferrer">{actionContent}</a>
      : <button className="submission-action" type="button" disabled aria-label={`Submit your PPT — ${scheduleWindow === 'upcoming' ? 'submission not open yet' : scheduleWindow === 'ended' ? 'submissions ended' : 'submission details pending'}`}>{actionContent}</button>}
    {scheduleWindow === 'upcoming' && <p className="submission-next__pending">Final submission opens with the decoding challenge. Review the brief and prepare your PPT in the meantime.</p>}
    {submissionOpen && !submissionUrl && <p className="submission-next__pending">Final submission details pending. Check back for the form and deadline.</p>}
  </section>;
}
