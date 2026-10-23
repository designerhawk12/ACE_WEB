import { Component, useCallback, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import gsap from 'gsap';
import { motion, useReducedMotion } from 'motion/react';

const INTRO_FAILSAFE_MS = 20_000;
const MACHINE_IMAGE = '/assets/typewriter/typewriter-base.png';

export type CinematicIntroProps = {
  onComplete: () => void;
  onSkip: () => void;
};

type IntroErrorBoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

type IntroErrorBoundaryState = {
  failed: boolean;
};

class IntroErrorBoundary extends Component<IntroErrorBoundaryProps, IntroErrorBoundaryState> {
  state: IntroErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): IntroErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Cinematic intro failed; continuing to the website.', error, errorInfo);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function CinematicIntroContent({ onComplete, onSkip }: CinematicIntroProps) {
  const shouldReduceMotion = useReducedMotion() === true;
  const stageRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [imageReady, setImageReady] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const updateStageScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = width < 700
        ? Math.min(width / 800, height / 900)
        : Math.min(width / 1200, height / 900, 1.25);

      stageRef.current?.style.setProperty('--intro-stage-scale', String(scale));
    };

    updateStageScale();
    window.addEventListener('resize', updateStageScale);
    return () => window.removeEventListener('resize', updateStageScale);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !imageReady || !stageRef.current || !machineRef.current || !paperRef.current) return;

    const context = gsap.context(() => {
      gsap.set(machineRef.current, { y: 420, opacity: 0 });
      gsap.set(paperRef.current, { y: 180 });

      gsap.timeline()
        .to(machineRef.current, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
        .to(paperRef.current, { y: 18, duration: 0.65, ease: 'power2.inOut' }, '-=0.15')
        .call(() => setPreviewReady(true));
    }, stageRef);

    return () => context.revert();
  }, [imageReady, shouldReduceMotion]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      event.preventDefault();
      onSkip();
    };

    const failsafeTimer = window.setTimeout(onComplete, INTRO_FAILSAFE_MS);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(failsafeTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, onSkip]);

  const handleMotionComplete = useCallback(() => {
    if (shouldReduceMotion) onComplete();
  }, [onComplete, shouldReduceMotion]);

  return (
    <motion.section
      animate={shouldReduceMotion ? { opacity: [0, 1, 0] } : { opacity: 1 }}
      aria-labelledby="intro-title"
      aria-modal="true"
      className="cinematic-intro"
      initial={shouldReduceMotion ? { opacity: 0 } : false}
      onAnimationComplete={handleMotionComplete}
      role="dialog"
      transition={shouldReduceMotion
        ? { duration: 0.45, ease: 'easeOut', times: [0, 0.35, 1] }
        : { duration: 0 }}
    >
      {!shouldReduceMotion && (
        <div className="intro-stage-fit" ref={stageRef} aria-hidden="true">
          <div className="machine-entry" ref={machineRef}>
            <div className="machine-recoil">
              <img
                className="machine-base"
                src={MACHINE_IMAGE}
                alt=""
                onLoad={() => setImageReady(true)}
                onError={onComplete}
                draggable={false}
              />
              <div className="paper-aperture">
                <div className="paper-feed" ref={paperRef}>
                  <div className="paper-sheet" />
                </div>
              </div>
              <div className="machine-platen-foreground" />
            </div>
          </div>
        </div>
      )}
      <div className="transition-hairline" aria-hidden="true" />
      <div className="intro-identity-overlay" aria-hidden="true" />
      <div className="cinematic-intro__frame">
        <div className="cinematic-intro__topline" aria-hidden="true">
          <span>ACE CLUB</span>
          <span>FIELD ENTRY / 00</span>
        </div>

        {shouldReduceMotion && <div className="cinematic-intro__center">
          <div className="cinematic-intro__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="eyebrow">A.C.E. / PRESENTS</p>
          <h1 id="intro-title">The work begins<br />with a question.</h1>
          <p className="cinematic-intro__note">CINEMATIC INTRO / PLACEHOLDER</p>
        </div>}

        <div className="cinematic-intro__bottomline">
          <p>REVERSE ENGINEERING<br />EVENT ACCESS // 01</p>
          <div className="cinematic-intro__actions" aria-label="Enter the event page">
            {previewReady && <button className="text-action text-action--primary" onClick={onComplete} type="button">
              CONTINUE <span aria-hidden="true">↗</span>
            </button>}
            <button className="text-action" onClick={onSkip} type="button">
              SKIP INTRO <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function CinematicIntro(props: CinematicIntroProps) {
  return (
    <IntroErrorBoundary onError={props.onComplete}>
      <CinematicIntroContent {...props} />
    </IntroErrorBoundary>
  );
}
