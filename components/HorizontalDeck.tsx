'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Panels laid side by side, moved sideways by vertical scroll.
 *
 * The wheel still scrolls down — the page simply travels across instead. Pinned
 * so the panels move within a held frame rather than the whole document sliding,
 * which keeps the rail and any fixed furniture still.
 *
 * Scroll distance is the track's overflow, so panels of different widths each
 * take a proportionate share of the wheel rather than a fixed number of turns.
 */
export default function HorizontalDeck({
  onProgress,
  children,
}: {
  onProgress?: (p: number) => void;
  children: React.ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current!;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);

      const st = ScrollTrigger.create({
        trigger: frame.current,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(el, { x: -distance() * self.progress });
          onProgress?.(self.progress);
        },
      });

      return () => st.kill();
    },
    { scope: frame, dependencies: [onProgress] }
  );

  return (
    <div ref={frame} className="deck">
      <div ref={track} className="deck__track">
        {children}
      </div>
    </div>
  );
}
