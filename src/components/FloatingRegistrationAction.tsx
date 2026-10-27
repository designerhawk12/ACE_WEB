import { eventConfig, getPublicEventUrl } from '../config/event';
import { isRegistrationOpenAt } from '../config/schedule';
import { useRegistrationOpen } from '../hooks/useEventClock';

export function FloatingRegistrationAction() {
  const registrationOpen = useRegistrationOpen();
  const url = getPublicEventUrl(eventConfig.registrationUrl);

  if (!registrationOpen || !url) return null;

  return <a
    className="registration-float"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Register for the ACE Reverse Engineering event (opens in a new tab)"
    onClick={event => { if (!isRegistrationOpenAt(Date.now())) event.preventDefault(); }}
  >
    <span className="registration-float__mark" aria-hidden="true" />
    <span>REGISTER</span>
    <span aria-hidden="true">↗</span>
  </a>;
}
