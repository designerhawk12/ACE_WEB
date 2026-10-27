import { useCallback, useRef, useState, type MouseEvent } from 'react';
import { CinematicIntro } from './components/CinematicIntro';
import { EventPhaseContent } from './components/EventPhaseContent';
import { EventTimeline } from './components/EventTimeline';
import { HeroVideo } from './components/HeroVideo';
import { EmergencyEventControl } from './components/EmergencyEventControl';
import { FloatingRegistrationAction } from './components/FloatingRegistrationAction';
import { SubmissionAction } from './components/SubmissionAction';
import { useTeaserMotion } from './hooks/useTeaserMotion';
import { useEventRuntime } from './context/EventRuntime';
import { eventConfig, getPublicEventUrl, phasePresentation } from './config/event';
import { isRegistrationOpenAt } from './config/schedule';
import { useRegistrationOpen, useSubmissionOpen } from './hooks/useEventClock';
import { nextTap, type TapSequence } from './lib/emergencyTap';

function BrandMark({ onClick }: { onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a className="brand" href="#top" aria-label="ACE Club — back to top" onClick={onClick}>
      <img src="/ace-mark.svg" alt="" width="34" height="34" />
      <span className="brand__wordmark">ACE <span>CLUB</span></span>
    </a>
  );
}

function ArrowIcon() {
  return <span className="arrow-icon" aria-hidden="true">↗</span>;
}

type EventActionProps = {
  className: string;
  href: string;
  index: string;
  label: string;
  state: string;
  registration?: boolean;
};

function EventAction({ className, href, index, label, state, registration = false }: EventActionProps) {
  const registrationOpen = useRegistrationOpen();
  const closed = registration && !registrationOpen;
  const publicUrl = closed ? null : getPublicEventUrl(href);
  const content = <>
    <span className="action-card__index">{index} / {closed ? 'REGISTRATIONS ENDED' : publicUrl ? state : 'LINK PENDING'}</span>
    <span className="action-card__label">{label}</span>
    <ArrowIcon />
  </>;

  if (!publicUrl) {
    return <button aria-label={`${label} — ${closed ? 'registrations ended' : 'link pending'}`} className={`action-card ${className} action-card--pending`} disabled title={closed ? 'Registrations ended' : 'Link pending; check back soon'} type="button">{content}</button>;
  }

  return <a className={`action-card ${className}`} href={publicUrl} onClick={registration ? event => { if (!isRegistrationOpenAt(Date.now())) event.preventDefault(); } : undefined} rel="noopener noreferrer" target="_blank">{content}</a>;
}

export default function App() {
  const { phase, accessGranted } = useEventRuntime();
  const submissionOpen = useSubmissionOpen();
  const [introOpen, setIntroOpen] = useState(true);
  const [controlOpen, setControlOpen] = useState(false);
  const tapsRef = useRef<TapSequence>({ count: 0, startedAt: 0 });
  const introDismissedRef = useRef(false);
  const mainRef = useRef<HTMLElement>(null);
  useTeaserMotion(mainRef, !introOpen);

  const dismissIntro = useCallback(() => {
    if (introDismissedRef.current) return;

    introDismissedRef.current = true;
    setIntroOpen(false);
    window.requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
  }, []);

  const completeIntro = useCallback(() => dismissIntro(), [dismissIntro]);
  const skipIntro = useCallback(() => dismissIntro(), [dismissIntro]);
  const onBrandClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    const result = nextTap(tapsRef.current, Date.now());
    tapsRef.current = result.sequence;
    if (result.sequence.count > 1 || result.unlocked) event.preventDefault();
    if (result.unlocked) setControlOpen(true);
  }, []);

  return (
    <>
      {introOpen && <CinematicIntro onComplete={completeIntro} onSkip={skipIntro} />}
      <a className="skip-link" href="#main-content" hidden={introOpen}>Skip to content</a>

      <div
        aria-hidden={introOpen || undefined}
        className={`site-shell${introOpen ? ' site-shell--intro-active' : ''}`}
        id="top"
        inert={introOpen ? true : undefined}
      >
        <header className="site-header page-gutter">
          <BrandMark onClick={onBrandClick} />
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#challenge">THE CHALLENGE</a>
            <a href="#timeline">SEQUENCE</a>
          </nav>
          <span className="header-status"><i aria-hidden="true" /> {phasePresentation[phase].headerLabel}</span>
        </header>

        <main id="main-content" ref={mainRef} tabIndex={-1}>
          <section className="hero page-gutter" aria-labelledby="hero-title">
            <div className="hero__copy">
              <div className="hero__metadata">
                {(phase === 'puzzle' || phase === 'problem-unlocked') && <span className="index-number" aria-label="Section 01">01</span>}
                <span className="eyebrow">ACE PRESENTS</span>
                <span className="hero__rule" aria-hidden="true" />
                <span className="eyebrow">RESEARCH / 001</span>
              </div>
              <h1 className="hero__title" id="hero-title">
                <span className="hero__title-serif">Reverse</span>
                <span className="hero__title-sans">Engineering<span className="hero__period">.</span></span>
              </h1>
              <div className="hero__closing">
                <p className="hero__tagline">Take it apart.<br />Trace the logic. Tell the story.</p>
                <p className="hero__side-note">A CHALLENGE IN CURIOSITY,<br />SYSTEMS &amp; CREATIVE THINKING.</p>
              </div>
              <a className="hero__scroll" href="#timeline">
                <span className="hero__scroll-line" aria-hidden="true" />
                SCROLL TO EXPLORE
              </a>
            </div>

            <HeroVideo active={!introOpen} />
          </section>

          <EventTimeline phase={phase} />

          <section className="about section-rule page-gutter" aria-labelledby="about-title">
            <div className="section-index"><span className="index-number">03</span><span className="index-line" aria-hidden="true" /><span className="eyebrow">WHAT IS REVERSE ENGINEERING?</span></div>
            <div className="about__content">
              <h2 id="about-title">Understand the thing<br /><em>by unmaking the mystery.</em></h2>
              <div className="about__description">
                <p>Reverse engineering starts with what you can observe. Work backward through a system, object, or process to understand the decisions and mechanisms inside it.</p>
                <p>In this challenge, curiosity is your tool kit. Investigate, form a theory, test it against evidence, then make your reasoning clear.</p>
                <a className="inline-link" href="#challenge">EXPLORE THE CHALLENGE <span aria-hidden="true">↓</span></a>
              </div>
            </div>
            <div className="about__drawing" aria-hidden="true">
              <div className="drawing-caption drawing-caption--top"><span>FIG. 01</span><span>ASSEMBLY / UNKNOWN</span></div>
              <svg viewBox="0 0 520 520" className="schematic" focusable="false">
                <defs>
                  <pattern id="microGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity=".16" strokeWidth=".7" />
                  </pattern>
                </defs>
                <rect x="26" y="26" width="468" height="468" fill="url(#microGrid)" />
                <path d="M90 260h340M260 90v340" stroke="currentColor" strokeOpacity=".42" strokeDasharray="4 8" />
                <circle cx="260" cy="260" r="142" fill="none" stroke="currentColor" strokeOpacity=".72" strokeWidth="1.1" />
                <circle cx="260" cy="260" r="108" fill="none" stroke="currentColor" strokeOpacity=".28" strokeDasharray="2 6" />
                <path d="m260 128 105 132-105 132-105-132 105-132Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="m208 208 104 104m0-104L208 312" stroke="currentColor" strokeOpacity=".72" strokeWidth="1.2" />
                <path d="M260 36v36m0 376v36M36 260h36m376 0h36" stroke="currentColor" strokeWidth="2" />
                <circle cx="260" cy="260" r="5" fill="#b74235" />
                <path d="M382 144h57v-42h38m-55 274h55v43h-38M80 102h42V60h38" fill="none" stroke="#b74235" strokeWidth="1.4" />
                <path d="M421 94h56M437 420h40M75 58h54" stroke="#b74235" strokeWidth="1.4" />
              </svg>
              <div className="drawing-annotation drawing-annotation--right"><span className="annotation-dot" /> DISASSEMBLY / IN PROGRESS</div>
              <div className="drawing-caption drawing-caption--bottom"><span>TRACE EVERY CONNECTION</span><span>R // E</span></div>
            </div>
          </section>

          <EventPhaseContent phase={phase} />

          <section className="participate section-rule page-gutter" id="participate" aria-labelledby="participate-title">
            <div className="section-index"><span className="index-number">05</span><span className="index-line" aria-hidden="true" /><span className="eyebrow">PARTICIPATE</span></div>
            <h2 className="participate__heading" id="participate-title">Take the next step.</h2>
            <div className="action-band">
              <EventAction className="action-card--register" href={eventConfig.registrationUrl} index="01 / REGISTER" label="Register for Event" state="OPEN" registration />
              <EventAction className="action-card--whatsapp" href={eventConfig.whatsappUrl} index="02 / CONNECT" label="Join WhatsApp Group" state="CONNECT" />
            </div>
          </section>
        </main>

        <footer className="site-footer page-gutter">
          <div className="site-footer__brand">
            <BrandMark />
            <p>Curiosity is a method.</p>
          </div>
          <div className="site-footer__detail">
            <span>ACE CLUB / REVERSE ENGINEERING</span>
            <span>THE DETAILS ARE IN THE DISASSEMBLY.</span>
          </div>
          <a className="back-to-top" href="#top">BACK TO TOP <span aria-hidden="true">↑</span></a>
        </footer>
      </div>
      {!introOpen && <div className="floating-actions">
        <FloatingRegistrationAction />
        {accessGranted && submissionOpen && <SubmissionAction floating />}
      </div>}
      <EmergencyEventControl open={controlOpen} onClose={() => setControlOpen(false)} />
    </>
  );
}
