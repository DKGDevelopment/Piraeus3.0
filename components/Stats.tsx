'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const STATS = [
  { value: 105000, label: 'GBA', unit: 'sqm' },
  { value: 631, label: 'Residences' },
  { value: 268, label: 'Serviced Apartments' },
];

/**
 * Headline figures, counted up once the descent is revealed. The count is
 * written straight to the node: React state at 60fps for three numbers would
 * re-render the hero on every tick for no benefit.
 */
export default function Stats() {
  const root = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      gsap.from('.stat', { opacity: 0, y: 14, duration: 0.8, stagger: 0.12, delay: 0.35 });

      STATS.forEach((s, i) => {
        const node = root.current?.querySelectorAll('.stat__value')[i];
        if (!node) return;
        const count = { n: 0 };
        gsap.to(count, {
          n: s.value,
          duration: 1.9,
          delay: 0.45 + i * 0.12,
          ease: 'power2.out',
          onUpdate: () => {
            node.textContent = Math.round(count.n).toLocaleString('en-US');
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <dl className="stats" ref={root}>
      {STATS.map((s) => (
        <div className="stat" key={s.label}>
          <dt className="stat__label">{s.label}</dt>
          <dd className="stat__figure">
            <span className="stat__value">0</span>
            {s.unit && <span className="stat__unit">{s.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
