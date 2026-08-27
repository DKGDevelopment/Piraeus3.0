'use client';

import Link from 'next/link';
import { useContext, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SequenceScrub } from '@/lib/stage';
import { BUILDINGS, coverFit, spotAt, type ChapterSpot } from '@/lib/buildings';

/**
 * Markers on a walking chapter, each appearing while its building is in frame.
 * No names: the assets were introduced on the way down, and labels across a
 * facade at this distance would cover the thing being pointed at.
 */
export default function ChapterSpots({ spots }: { spots: ChapterSpot[] }) {
  const ctx = useContext(SequenceScrub);
  const nodes = useRef<Map<string, HTMLElement>>(new Map());

  useGSAP(
    () => {
      if (!ctx?.tier) return;
      const { width, height } = ctx.tier;

      const place = (p: number) => {
        const toPx = coverFit(width, height, window.innerWidth, window.innerHeight);
        for (const s of spots) {
          const node = nodes.current.get(s.id);
          if (!node) continue;
          const at = spotAt(s, p);
          const px = toPx(at.x, at.y);
          gsap.set(node, {
            x: px.x,
            y: px.y,
            opacity: at.opacity,
            pointerEvents: at.opacity > 0.6 ? 'auto' : 'none',
            overwrite: 'auto',
          });
        }
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
    { dependencies: [ctx, spots] }
  );

  return (
    <>
      {spots.map((s) => (
        <Link
          key={s.id}
          href={`/assets/${s.id}`}
          className="hotspot"
          aria-label={`Explore ${BUILDINGS.find((b) => b.id === s.id)?.name ?? s.id}`}
          ref={(node) => {
            if (node) nodes.current.set(s.id, node);
          }}
        >
          <span className="hotspot__pulse" />
          <span className="hotspot__ring" />
          <span className="hotspot__core" />
        </Link>
      ))}
    </>
  );
}
