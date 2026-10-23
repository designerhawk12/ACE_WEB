import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useTeaserMotion(root: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !root.current) return;
    const media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 1100px)', mobile: '(max-width: 1099px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      if (context.conditions?.reduced) return;
      const desktop = context.conditions?.desktop;
      const select = gsap.utils.selector(root.current);
      select('.timeline__item, .about__content > *, .about__drawing, .participate__heading, .action-card').forEach((element: HTMLElement) => {
        gsap.from(element, { y: desktop ? 16 : 12, opacity: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
      });
      gsap.from(select('.timeline__progress'), { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: select('.timeline__list')[0], start: 'top 75%', end: 'bottom 65%', scrub: 0.5 } });
      const challenge = select('.challenge:not(.puzzle-stage)')[0];
      if (challenge) gsap.timeline({ scrollTrigger: { trigger: challenge, start: 'top 75%', once: true } })
        .from(select('.challenge__reveal-rule'), { scaleX: 0, transformOrigin: 'left', duration: 0.25 })
        .from(select('.challenge__kicker'), { opacity: 0, duration: 0.28 }, 0.12)
        .from(select('.challenge__headline'), { yPercent: 110, duration: 0.55, ease: 'power3.out' }, 0.25)
        .from(select('.challenge__description, .challenge__plate'), { opacity: 0, y: 12, duration: 0.35 }, 0.5);
      if (desktop) gsap.to(select('.hero-media'), { y: -24, ease: 'none', scrollTrigger: { trigger: select('.hero')[0], start: 'top top', end: 'bottom top', scrub: 0.6 } });
    }, root.current);
    ScrollTrigger.refresh();
    return () => media.revert();
  }, [root, active]);
}
