'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { StageScrub } from '@/lib/stage';
import { scrollToY } from '@/lib/lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * One pinned stage carrying every chapter of the journey.
 *
 * Each chapter used to pin itself, so at every boundary one canvas unpinned and
 * scrolled away while the next scrolled up behind it — a visible slide between
 * two shots that are meant to be continuous. Here the stage pins once for the
 * whole journey and scroll drives a single playhead across it, so chapters hand
 * over in place and nothing ever unpins mid-journey.
 *
 * The playhead is measured in viewport heights travelled rather than a 0-1
 * fraction, so a chapter's own progress does not shift when another is added.
 */
export default function Stage({
  length,
  children,
}: {
  /** Total scroll, in viewport heights. */
  length: number;
  children: React.ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const listeners = useRef<Set<(travelled: number) => void>>(new Set());
  const travelled = useRef(0);

  const api = useRef({
    subscribe: (fn: (t: number) => void) => {
      fn(travelled.current);
      listeners.current.add(fn);
      return () => {
        listeners.current.delete(fn);
      };
    },
    goTo: (offset: number) => {
      scrollToY((wrap.current?.offsetTop ?? 0) + offset * window.innerHeight);
    },
  }).current;

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: wrap.current,
        start: 'top top',
        end: `+=${length * 100}%`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          travelled.current = self.progress * length;
          for (const fn of listeners.current) fn(travelled.current);
        },
      });
      return () => st.kill();
    },
    { scope: wrap, dependencies: [length] }
  );

  return (
    <div ref={wrap} className="stage">
      <StageScrub.Provider value={api}>{children}</StageScrub.Provider>
    </div>
  );
}
