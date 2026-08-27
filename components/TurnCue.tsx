'use client';

import { useContext, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SequenceScrub } from './SequenceCanvas';
import { coverFit } from '@/lib/buildings';
import { scrollToEl } from '@/lib/lenis';

type Props = {
  label: string;
  /** Element id of the chapter this turns into. */
  target: string;
  /** Anchor in frame space, at the cue's entry and at the last frame. */
  from: { x: number; y: number };
  to: { x: number; y: number };
  enter: number;
};

/**
 * A turn into the next chapter, placed on the street it leads down.
 *
 * A bare arrow would read as a slideshow control; this stays a piece of the
 * scene — anchored in frame space like the building markers, drifting with the
 * camera, and nudging along its own axis to suggest the direction of travel.
 */
export default function TurnCue({ label, target, from, to, enter }: Props) {
  const ctx = useContext(SequenceScrub);
  const root = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!ctx?.tier || !root.current) return;
      const el = root.current;
      const { width, height } = ctx.tier;

      const place = (p: number) => {
        const t = gsap.utils.clamp(0, 1, (p - enter) / (1 - enter));
        const toPx = coverFit(width, height, window.innerWidth, window.innerHeight);
        const at = toPx(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
        const opacity = gsap.utils.clamp(0, 1, (p - enter) / 0.06);
        gsap.set(el, {
          x: at.x,
          y: at.y,
          opacity,
          pointerEvents: opacity > 0.6 ? 'auto' : 'none',
          overwrite: 'auto',
        });
      };

      let last = 0;
      const unsubscribe = ctx.subscribe((p) => {
        last = p;
        place(p);
      });
      const onResize = () => place(last);
      window.addEventListener('resize', onResize);

      return () => {
        unsubscribe();
        window.removeEventListener('resize', onResize);
      };
    },
    { dependencies: [ctx] }
  );

  const go = () => {
    const el = document.getElementById(target);
    if (el) scrollToEl(el);
  };

  return (
    <button ref={root} type="button" className="turn" onClick={go} aria-label={label}>
      <span className="turn__ring">
        <svg className="turn__arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="turn__label">{label}</span>
    </button>
  );
}
