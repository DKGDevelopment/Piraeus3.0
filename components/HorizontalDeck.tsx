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

      // Snaps the settled scroll position to a panel edge, so a wheel flick
      // that only nudges past one panel doesn't strand the reader half
      // in and out of the next — they land on it and hold there until they
      // deliberately scroll again.
      const panelEdges = () => {
        const d = distance();
        if (d <= 0) return [0];
        return Array.from(el.children).map((child) =>
          Math.min(1, (child as HTMLElement).offsetLeft / d)
        );
      };

      const st = ScrollTrigger.create({
        trigger: frame.current,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (value) =>
            panelEdges().reduce((closest, edge) =>
              Math.abs(edge - value) < Math.abs(closest - value) ? edge : closest
            ),
          duration: 0.5,
          ease: 'power1.inOut',
        },
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
