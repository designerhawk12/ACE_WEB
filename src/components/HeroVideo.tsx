import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export function HeroVideo({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active || reduceMotion || failed) return;
    let visible = true;
    let disposed = false;
    const sync = () => {
      if (!visible || document.hidden || paused) video.pause();
      else void video.play().catch(() => { if (!disposed) setFailed(true); });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause(); };
  }, [active, reduceMotion, failed, paused]);

  return <figure className="hero-media">
    <figcaption className="hero-media__caption"><span>FIG. 01</span><span>MECHANICAL STUDY</span></figcaption>
    <div className="hero-media__surface">
      {reduceMotion || failed || !active
        ? <img src="/assets/typewriter/typewriter-base.png" alt="Vintage mechanical typewriter" width="1149" height="1369" />
        : <video ref={videoRef} autoPlay loop muted playsInline controls={false} preload="metadata" aria-label="Looping mechanical typewriter study" onError={() => setFailed(true)}>
          <source src="/assets/video/typewriter-hero.mp4" type="video/mp4" />
        </video>}
    </div>
    <div className="hero-media__caption"><span>TRACE EVERY CONNECTION</span>
      {!reduceMotion && !failed && active && <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'RESUME MOTION' : 'PAUSE MOTION'}</button>}
    </div>
  </figure>;
}
