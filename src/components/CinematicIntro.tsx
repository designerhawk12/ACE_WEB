import { Component, useCallback, useEffect, useRef, useState, type CSSProperties, type ErrorInfo, type ReactNode } from 'react';
import gsap from 'gsap';
import { motion, useReducedMotion } from 'motion/react';

const INTRO_FAILSAFE_MS = 20_000;
const MACHINE_IMAGE = '/assets/typewriter/typewriter-base.png';
const WORD = 'REVERSE';
const SECOND_LINE = 'ENGINEERING';
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
  const secondTravelRef = useRef<HTMLDivElement>(null);
  const strikerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const correctionRef = useRef<HTMLDivElement>(null);
  const [imageReady, setImageReady] = useState(false);

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
    if (shouldReduceMotion || !imageReady || !stageRef.current || !machineRef.current || !recoilRef.current || !paperRef.current || !paperTravelRef.current || !secondTravelRef.current || !strikerRef.current || !introRef.current || !identityRef.current || !frameRef.current || !correctionRef.current) return;

    const siteShell = document.querySelector<HTMLElement>('.site-shell');
    const alignIdentity = () => {
      const pairs = [
        ['.hero__metadata .eyebrow', '.intro-identity__eyebrow'],
        ['.hero__title-serif', '.intro-identity__serif'],
        ['.hero__title-sans', '.intro-identity__sans'],
      ];
      for (const [sourceSelector, targetSelector] of pairs) {
        const source = siteShell?.querySelector<HTMLElement>(sourceSelector);
        const target = identityRef.current?.querySelector<HTMLElement>(targetSelector);
        if (!source || !target) continue;
        const rect = source.getBoundingClientRect();
        gsap.set(target, { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      }
    };
    alignIdentity();
    window.addEventListener('resize', alignIdentity);

    const context = gsap.context(() => {
      const firstGlyphs = Array.from(stageRef.current!.querySelectorAll<HTMLElement>('.paper-glyph--first'));
      const secondGlyphs = Array.from(stageRef.current!.querySelectorAll<HTMLElement>('.paper-glyph--second'));
      const identityParts = Array.from(identityRef.current!.querySelectorAll<HTMLElement>('.intro-identity__part'));
      const keys = new Map(
        Array.from(stageRef.current!.querySelectorAll<HTMLElement>('.key-overlay'))
          .map((key) => [key.dataset.key, key]),
      );
      gsap.set(machineRef.current, { y: 420, opacity: 0 });
      gsap.set(paperRef.current, { y: 180 });
      gsap.set(paperTravelRef.current, { x: 0 });
      gsap.set(secondTravelRef.current, { x: 0 });
      gsap.set([...firstGlyphs, ...secondGlyphs], { opacity: 0 });
      gsap.set(identityParts, { opacity: 0, y: 12 });
      gsap.set(correctionRef.current, { opacity: 0 });

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
          .set(firstGlyphs[index], { opacity: index % 3 === 1 ? 0.92 : 0.95 }, start + 0.055)
          .to(recoilRef.current, { y: 0.7, rotation: -0.025, duration: 0.02, ease: 'power1.out' }, start + 0.055)
          .to(paperTravelRef.current, { x: -LETTER_PITCH * (index + 1), duration: 0.06, ease: 'power2.out' }, start + 0.065)
          .to(strikerRef.current, { y: 0, rotation: 0, duration: 0.07, ease: 'power2.out' }, start + 0.065)
          .to(recoilRef.current, { y: 0, rotation: 0, duration: 0.09, ease: 'power2.out' }, start + 0.075)
          .to(key, { y: 0, scaleY: 1, duration: 0.09, ease: 'power2.out' }, start + 0.08);
      });

      // The last impression lands crooked; the carriage backs up one pitch for a clean overprint.
      timeline
        .to(firstGlyphs[6], { y: 2, rotation: -4, duration: 0.07, ease: 'power2.out' }, 3.09)
        .to(paperTravelRef.current, { x: -179, y: 0.8, duration: 0.045, ease: 'power1.inOut' }, 3.13)
        .to(paperTravelRef.current, { x: -182, y: 0, duration: 0.055, ease: 'power2.out' }, 3.175)
        .to(paperTravelRef.current, { x: -156, duration: 0.09, ease: 'power2.inOut' }, 3.24)
        .to(correctionRef.current, { opacity: 1, duration: 0.035 }, 3.335)
        .set(firstGlyphs[6], { opacity: 0 }, 3.37)
        .to(strikerRef.current, { y: -21, rotation: -3, duration: 0.035, ease: 'power3.in' }, 3.405)
        .set(firstGlyphs[6], { opacity: 0.95, y: 0, rotation: 0 }, 3.455)
        .set(correctionRef.current, { opacity: 0 }, 3.455)
        .to(recoilRef.current, { y: 0.7, duration: 0.02 }, 3.455)
        .to(paperTravelRef.current, { x: -182, duration: 0.06, ease: 'power2.out' }, 3.465)
        .to(strikerRef.current, { y: 0, rotation: 0, duration: 0.08, ease: 'power2.out' }, 3.465)
        .to(recoilRef.current, { y: 0, duration: 0.08 }, 3.48)
        .to(paperTravelRef.current, { x: 0, duration: 0.28, ease: 'power2.inOut' }, 3.64)
        .to(paperRef.current, { y: -20, duration: 0.24, ease: 'power2.inOut' }, 3.72);

      SECOND_LINE.split('').forEach((_, index) => {
        const start = 4.02 + index * 0.115;
        timeline
          .to(strikerRef.current, { y: -21, rotation: -3, duration: 0.028, ease: 'power3.in' }, start)
          .set(secondGlyphs[index], { opacity: index % 4 === 2 ? 0.92 : 0.95 }, start + 0.038)
          .to(recoilRef.current, { y: 0.65, rotation: -0.02, duration: 0.018 }, start + 0.038)
          .to(secondTravelRef.current, { x: -LETTER_PITCH * (index + 1), duration: 0.045, ease: 'power2.out' }, start + 0.048)
          .to(strikerRef.current, { y: 0, rotation: 0, duration: 0.055, ease: 'power2.out' }, start + 0.05)
          .to(recoilRef.current, { y: 0, rotation: 0, duration: 0.06 }, start + 0.057);
      });

      timeline
        .to(secondTravelRef.current, { x: 0, duration: 0.22, ease: 'power2.inOut' }, 5.29)
        .to(machineRef.current, { y: 75, opacity: 0, duration: 0.58, ease: 'power2.in' }, 5.7)
        .to([...firstGlyphs, ...secondGlyphs], { opacity: 0, duration: 0.28 }, 5.82)
        .to(frameRef.current, { opacity: 0, duration: 0.32 }, 5.82)
        .call(alignIdentity, [], 6.24)
        .set(identityRef.current, { opacity: 1 }, 6.26)
        .to(identityParts[0], { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 6.3)
        .to(identityParts[1], { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 6.6)
        .to(identityParts[2], { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 6.72)
        .call(() => { alignIdentity(); siteShell?.classList.add('site-shell--intro-handoff'); }, [], 7.42)
        .to(introRef.current, { opacity: 0, duration: 0.38, ease: 'power1.inOut' }, 7.42)
        .call(onComplete, [], 7.8);
    }, stageRef);

    return () => {
      window.removeEventListener('resize', alignIdentity);
      siteShell?.classList.remove('site-shell--intro-handoff');
      context.revert();
    };
  }, [imageReady, shouldReduceMotion, onComplete]);

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
      ref={introRef}
      animate={shouldReduceMotion ? { opacity: [0, 1, 0] } : { opacity: 1 }}
      aria-label="Reverse Engineering cinematic introduction"
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
                          <span className="paper-glyph paper-glyph--first" key={`${letter}-${index}`} style={{ left: `${240 + index * LETTER_PITCH}px` }}>{letter}</span>
                        ))}
                        <div className="paper-second-travel" ref={secondTravelRef}>
                          {SECOND_LINE.split('').map((letter, index) => (
                            <span className="paper-glyph paper-glyph--second" key={`second-${index}`} style={{ left: `${240 + index * LETTER_PITCH}px` }}>{letter}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="paper-correction" ref={correctionRef} />
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
      <div className="intro-identity-overlay" ref={identityRef} aria-hidden="true">
        <span className="eyebrow intro-identity__part intro-identity__eyebrow">ACE PRESENTS</span>
        <span className="hero__title-serif intro-identity__part intro-identity__serif">Reverse</span>
        <span className="hero__title-sans intro-identity__part intro-identity__sans">Engineering<span className="hero__period">.</span></span>
      </div>
      <div className="cinematic-intro__frame" ref={frameRef}>
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
          <p className="cinematic-intro__note">REVERSE ENGINEERING / ACE CLUB</p>
        </div>}

        <div className="cinematic-intro__bottomline">
          <p>REVERSE ENGINEERING<br />EVENT ACCESS // 01</p>
          <div className="cinematic-intro__actions" aria-label="Enter the event page">
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
