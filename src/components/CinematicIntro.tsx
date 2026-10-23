import { Component, useCallback, useEffect, useRef, useState, type CSSProperties, type ErrorInfo, type ReactNode } from 'react';
import gsap from 'gsap';
import { motion, useReducedMotion } from 'motion/react';

const INTRO_FAILSAFE_MS = 20_000;
const MACHINE_IMAGE = '/assets/typewriter/typewriter-base.png';
const WORD = 'REVERSE';
const LETTER_PITCH = 26;
// Key centers in the 1149px-wide master image, converted to the 960px stage image.
const KEY_CENTERS = {
  R: [424, 869],
  E: [357, 869],
  V: [474, 1005],
  S: [303, 937],
} as const;

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
  const recoilRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const paperTravelRef = useRef<HTMLDivElement>(null);
  const strikerRef = useRef<HTMLDivElement>(null);
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
    if (shouldReduceMotion || !imageReady || !stageRef.current || !machineRef.current || !recoilRef.current || !paperRef.current || !paperTravelRef.current || !strikerRef.current) return;

    const context = gsap.context(() => {
      const glyphs = Array.from(stageRef.current!.querySelectorAll<HTMLElement>('.paper-glyph'));
      const keys = new Map(
        Array.from(stageRef.current!.querySelectorAll<HTMLElement>('.key-overlay'))
          .map((key) => [key.dataset.key, key]),
      );
      gsap.set(machineRef.current, { y: 420, opacity: 0 });
      gsap.set(paperRef.current, { y: 180 });
      gsap.set(paperTravelRef.current, { x: 0 });
      gsap.set(glyphs, { opacity: 0 });

      const timeline = gsap.timeline()
        .to(machineRef.current, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
        .to(paperRef.current, { y: 18, duration: 0.65, ease: 'power2.inOut' }, '-=0.15');

      WORD.split('').forEach((letter, index) => {
        const start = 1.68 + index * 0.2;
        const key = keys.get(letter);
        if (!key) throw new Error(`Missing photographed key overlay: ${letter}`);

        timeline
          .to(key, { y: 5, scaleY: 0.94, duration: 0.04, ease: 'power2.in' }, start)
          .to(strikerRef.current, { y: -21, rotation: -3, duration: 0.04, ease: 'power3.in' }, start + 0.015)
          .set(glyphs[index], { opacity: index % 3 === 1 ? 0.92 : 0.95 }, start + 0.055)
          .to(recoilRef.current, { y: 0.7, rotation: -0.025, duration: 0.02, ease: 'power1.out' }, start + 0.055)
          .to(paperTravelRef.current, { x: -LETTER_PITCH * (index + 1), duration: 0.06, ease: 'power2.out' }, start + 0.065)
          .to(strikerRef.current, { y: 0, rotation: 0, duration: 0.07, ease: 'power2.out' }, start + 0.065)
          .to(recoilRef.current, { y: 0, rotation: 0, duration: 0.09, ease: 'power2.out' }, start + 0.075)
          .to(key, { y: 0, scaleY: 1, duration: 0.09, ease: 'power2.out' }, start + 0.08);
      });

      timeline.call(() => setPreviewReady(true), [], 3.08);
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
            <div className="machine-recoil" ref={recoilRef}>
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
                  <div className="paper-travel" ref={paperTravelRef}>
                    <div className="paper-sheet">
                      <div className="paper-ink-line">
                        {WORD.split('').map((letter, index) => (
                          <span className="paper-glyph" key={`${letter}-${index}`} style={{ left: `${240 + index * LETTER_PITCH}px` }}>{letter}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="intro-striker" ref={strikerRef} />
              <div className="machine-platen-foreground" />
              {Object.entries(KEY_CENTERS).map(([letter, [sourceX, sourceY]]) => {
                const centerX = 120 + sourceX * (960 / 1149);
                const centerY = -65 + sourceY * (960 / 1149);
                const cropStyle: CSSProperties = {
                  left: `${centerX - 23}px`,
                  top: `${centerY - 23}px`,
                  backgroundPosition: `${143 - centerX}px ${-42 - centerY}px`,
                };

                return <div className="key-overlay" data-key={letter} key={letter} style={cropStyle} />;
              })}
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
