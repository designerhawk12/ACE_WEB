import { useEffect } from 'react';

type IntroPlaceholderProps = {
  onEnter: () => void;
};

export function IntroPlaceholder({ onEnter }: IntroPlaceholderProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEnter();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter]);

  return (
    <section className="intro-placeholder" aria-labelledby="intro-title">
      <div className="intro-placeholder__frame">
        <div className="intro-placeholder__topline" aria-hidden="true">
          <span>ACE CLUB</span>
          <span>FIELD ENTRY / 00</span>
        </div>

        <div className="intro-placeholder__center">
          <div className="intro-placeholder__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="eyebrow">A.C.E. / PRESENTS</p>
          <h1 id="intro-title">The work begins<br />with a question.</h1>
          <p className="intro-placeholder__note">CINEMATIC INTRO / PLACEHOLDER</p>
        </div>

        <div className="intro-placeholder__bottomline">
          <p>REVERSE ENGINEERING<br />EVENT ACCESS // 01</p>
          <div className="intro-placeholder__actions" aria-label="Enter the event page">
            <button className="text-action text-action--primary" onClick={onEnter} type="button">
              ENTER <span aria-hidden="true">↗</span>
            </button>
            <button className="text-action" onClick={onEnter} type="button">
              SKIP <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
