'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  BUILDINGS,
  CALLOUT_WINDOW,
  GROUND_SPOTS,
  GROUND_START,
  anchorAt,
  coverFit,
  groundAnchorAt,
} from '@/lib/buildings';
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
  type Parts = { label?: HTMLElement; line?: SVGLineElement; spot?: HTMLElement };
  const ground = useRef<Map<string, HTMLElement>>(new Map());
  const items = useRef<Map<string, Parts>>(new Map());
  const put = (id: string, part: Partial<Parts>) => {
    items.current.set(id, { ...items.current.get(id), ...part });
  };

  useGSAP(
    () => {
      if (!tier) return;

      const place = (p: number) => {
        const toPx = coverFit(tier.width, tier.height, window.innerWidth, window.innerHeight);

        for (const b of BUILDINGS) {
          const el = items.current.get(b.id);
          if (!el?.label || !el.line || !el.spot) continue;

          const a = anchorAt(b, p);
          const anchor = toPx(a.x, a.y);
          const text = toPx(a.x + b.label.x, a.y + b.label.y);

          // Fade in over a short run past each callout's entry point, and out
          // again as its anchor leaves the frame during the push-in.
          const inView =
            a.x > -0.05 && a.x < 1.05 && a.y > -0.05 && a.y < 1.05;
          // Fade up on cue, then clear as the camera leaves the overhead view.
          const fadeIn = gsap.utils.clamp(0, 1, (p - b.enter) / 0.05);
          const fadeOut = gsap.utils.clamp(0, 1, (CALLOUT_WINDOW - p) / 0.05);
          const opacity = inView ? Math.min(fadeIn, fadeOut) : 0;

          // A faded callout is still in the layout, so it would otherwise keep
          // swallowing clicks over the frame.
          const pointerEvents = opacity > 0.6 ? 'auto' : 'none';

          gsap.set(el.label, { x: text.x, y: text.y, opacity, pointerEvents, overwrite: 'auto' });
          gsap.set(el.spot, { x: anchor.x, y: anchor.y, opacity, pointerEvents, overwrite: 'auto' });

          el.line.setAttribute('x1', String(anchor.x));
          el.line.setAttribute('y1', String(anchor.y));
          el.line.setAttribute('x2', String(text.x));
          el.line.setAttribute('y2', String(text.y));
          el.line.style.opacity = String(opacity);
        }

        for (const g of GROUND_SPOTS) {
          const node = ground.current.get(g.id);
          if (!node) continue;
          const a = groundAnchorAt(g, p);
          const at = toPx(a.x, a.y);
          const opacity = gsap.utils.clamp(0, 1, (p - (GROUND_START + 0.02)) / 0.05);
          gsap.set(node, {
            x: at.x,
            y: at.y,
            opacity,
            pointerEvents: opacity > 0.6 ? 'auto' : 'none',
            overwrite: 'auto',
          });
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
    <div ref={root} className="labels">
      <svg className="labels__lines">
        {BUILDINGS.map((b) => (
          <line
            key={b.id}
            className="labels__line"
            ref={(node) => {
              if (node) put(b.id, { line: node });
            }}
          />
        ))}
      </svg>

      {/* The marker sits on the building; the name sits at the end of its leader.
          Both open the asset, so either target works. */}
      {/* The street-level arrival: markers only, no names. */}
      {GROUND_SPOTS.map((g) => (
        <Link
          key={`ground-${g.id}`}
          href={`/assets/${g.id}`}
          className="hotspot"
          aria-label={`Explore ${BUILDINGS.find((b) => b.id === g.id)?.name ?? g.id}`}
          ref={(node) => {
            if (node) ground.current.set(g.id, node);
          }}
        >
          <span className="hotspot__pulse" />
          <span className="hotspot__ring" />
          <span className="hotspot__core" />
        </Link>
      ))}

      {BUILDINGS.map((b) => (
        <Link
          key={`spot-${b.id}`}
          href={`/assets/${b.id}`}
          className="hotspot"
          aria-label={`Explore ${b.name}`}
          ref={(node) => {
            if (node) put(b.id, { spot: node });
          }}
        >
          <span className="hotspot__pulse" />
          <span className="hotspot__ring" />
          <span className="hotspot__core" />
        </Link>
      ))}

      {BUILDINGS.map((b) => (
        <Link
          key={b.id}
          href={`/assets/${b.id}`}
          className="labels__item"
          ref={(node) => {
            if (node) put(b.id, { label: node });
          }}
        >
          <span className="labels__name">{b.name}</span>
        </Link>
      ))}
    </div>
  );
}
