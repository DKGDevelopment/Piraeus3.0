'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BUILDINGS, anchorAt, coverFit } from '@/lib/buildings';
import type { SequenceTier } from '@/lib/sequence';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  tier: SequenceTier | null;
  scrollLength: number;
  /** Element the sequence pins on, so both read the same scroll range. */
  triggerRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * Callouts naming each asset, tethered to their roofs by a dotted leader.
 *
 * Positions are written straight to the DOM from a ScrollTrigger rather than
 * through React state: this updates every scroll frame alongside the sequence,
 * and re-rendering seven components at that rate would cost more than the
 * canvas draw itself.
 */
export default function BuildingLabels({ tier, scrollLength, triggerRef }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<Map<string, { label: HTMLElement; line: SVGLineElement }>>(
    new Map()
  );

  useGSAP(
    () => {
      if (!tier) return;

      const place = (p: number) => {
        const toPx = coverFit(tier.width, tier.height, window.innerWidth, window.innerHeight);

        for (const b of BUILDINGS) {
          const el = items.current.get(b.id);
          if (!el) continue;

          const a = anchorAt(b, p);
          const anchor = toPx(a.x, a.y);
          const text = toPx(a.x + b.label.x, a.y + b.label.y);

          // Fade in over a short run past each callout's entry point, and out
          // again as its anchor leaves the frame during the push-in.
          const inView =
            a.x > -0.05 && a.x < 1.05 && a.y > -0.05 && a.y < 1.05;
          const opacity = inView
            ? gsap.utils.clamp(0, 1, (p - b.enter) / 0.06)
            : 0;

          gsap.set(el.label, {
            x: text.x,
            y: text.y,
            opacity,
            overwrite: 'auto',
          });
          el.line.setAttribute('x1', String(anchor.x));
          el.line.setAttribute('y1', String(anchor.y));
          el.line.setAttribute('x2', String(text.x));
          el.line.setAttribute('y2', String(text.y));
          el.line.style.opacity = String(opacity);
        }
      };

      // The headline and the callouts compete for the same frame, so the
      // headline clears as the first callout arrives.
      const title = document.querySelector('.hero__overlay');

      const st = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: `+=${scrollLength * 100}%`,
        scrub: 0.6,
        onUpdate: (self) => {
          place(self.progress);
          if (title) {
            gsap.set(title, {
              opacity: gsap.utils.clamp(0, 1, 1 - (self.progress - 0.04) / 0.06),
            });
          }
        },
      });

      const onResize = () => place(st.progress);
      window.addEventListener('resize', onResize);
      place(0);

      return () => window.removeEventListener('resize', onResize);
    },
    { scope: root, dependencies: [tier, scrollLength] }
  );

  return (
    <div ref={root} className="labels" aria-hidden="true">
      <svg className="labels__lines">
        {BUILDINGS.map((b) => (
          <line
            key={b.id}
            className="labels__line"
            ref={(node) => {
              if (!node) return;
              const prev = items.current.get(b.id);
              items.current.set(b.id, { label: prev?.label as HTMLElement, line: node });
            }}
          />
        ))}
      </svg>

      {BUILDINGS.map((b) => (
        <div
          key={b.id}
          className="labels__item"
          ref={(node) => {
            if (!node) return;
            const prev = items.current.get(b.id);
            items.current.set(b.id, { label: node, line: prev?.line as SVGLineElement });
          }}
        >
          <span className="labels__dot" />
          <span className="labels__name">{b.name}</span>
        </div>
      ))}
    </div>
  );
}
