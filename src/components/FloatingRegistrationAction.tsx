import { eventConfig, getPublicEventUrl } from '../config/event';

export function FloatingRegistrationAction() {
  const url = getPublicEventUrl(eventConfig.registrationUrl);

  if (!url) return null;

  return <a
    className="registration-float"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Register for the ACE Reverse Engineering event (opens in a new tab)"
  >
    <span className="registration-float__mark" aria-hidden="true" />
    <span>REGISTER</span>
    <span aria-hidden="true">↗</span>
  </a>;
}
