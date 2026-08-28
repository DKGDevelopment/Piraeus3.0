'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Residence } from '@/lib/residences';

/** Bands the incoming image is cut into. More of them reads as a finer sweep
 *  than a set of sliding panels. */
const BANDS = 20;

/**
 * A residence type: its gallery on one side, its description and the total area
 * on the other.
 *
 * Images change by wipe rather than fade: the incoming shot is cut into
 * horizontal bands that rise in sequence, so the new room assembles itself over
 * the old one. A crossfade would just dissolve two interiors into mush — this
 * keeps both readable throughout.
 */
export default function Residences({ residence }: { residence: Residence }) {
  const [active, setActive] = useState(0);
  // What the base layer is showing: the wipe lands on top of it, then becomes it.
  const [settled, setSettled] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const figure = useRef<HTMLSpanElement>(null);

  const room = residence.rooms[active];
  const base = residence.rooms[settled];
  const wiping = active !== settled;

  useGSAP(
    () => {
      if (!wiping) return;
      const bands = gsap.utils.toArray<HTMLElement>('.res__band');
      gsap.fromTo(
        bands,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.62,
          ease: 'power3.out',
          // Halved with twice the bands, so the wipe still lands in about the
          // same time rather than dragging on.
          stagger: 0.023,
          onComplete: () => setSettled(active),
        }
      );
    },
    { scope: stage, dependencies: [active, wiping] }
  );

  /**
   * The area counts up the first time the panel is reached rather than being
   * there already. The deck moves sideways, so the trigger is the figure
   * entering the viewport rather than a scroll position — an observer reads the
   * translated position correctly where a scroll offset would not.
   */
  useEffect(() => {
    const el = figure.current;
    if (!el || !residence.area) return;

    const format = (n: number) => Math.round(n).toLocaleString('en-US');
    const write = (t: number) =>
      (el.textContent = residence.areaMax
        ? `${format(residence.area * t)}\u2013${format(residence.areaMax * t)}`
        : format(residence.area * t));

    // The rendered figure stands until the count actually starts: writing zero
    // up front would show 0 to anyone who sees the panel's edge early, and
    // would leave the figure at zero if the observer never fired.
    let raf = 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        write(0);
        const started = performance.now();
        const DURATION = 1100;
        const tick = (now: number) => {
          const p = Math.min(1, (now - started) / DURATION);
          // Eased out, so the figure settles rather than stopping dead.
          write(1 - Math.pow(1 - p, 3));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [residence]);

  return (
    <div className="res">
      <div className="res__stage" ref={stage}>
        {base.image ? (
          <img className="res__shot" src={base.image} alt={base.label} />
        ) : (
          <div className="res__shot res__shot--empty">
            <span>{base.label}</span>
          </div>
        )}

        {wiping && room.image && (
          <div className="res__wipe" aria-hidden="true">
            {Array.from({ length: BANDS }, (_, i) => (
              <span
                key={i}
                className="res__band"
                style={{
                  top: `${(i * 100) / BANDS}%`,
                  height: `${100 / BANDS}%`,
                  backgroundImage: `url(${room.image})`,
                  // Each band shows its own slice of the same cover-fitted image,
                  // so together they reassemble one photograph rather than ten.
                  backgroundPosition: `50% ${(i * 100) / (BANDS - 1)}%`,
                }}
              />
            ))}
          </div>
        )}

        <p className="res__now">{room.label}</p>

        <div className="res__thumbs" role="tablist" aria-label="Rooms">
          {residence.rooms.map((r, i) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`res__thumb${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {r.image ? (
                <img src={r.image} alt="" />
              ) : (
                <span className="res__thumb-label">{r.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <aside className="res__panel">
        <p className="panel__eyebrow">Residences</p>
        <h2 className="res__name">{residence.name}</h2>
        <p className="res__copy">{residence.description}</p>

        <a className="res__cta" href="/contact">
          Book a visit
        </a>

        {/* One figure for the residence, not per room: the area given is the
            whole apartment, and inventing a breakdown would be fiction. */}
        <div className="res__figure">
          <p className="res__room">
            {residence.areaMax ? 'Interior area' : 'Total area'}
          </p>
          <p className="res__area">
            {/* A range where the layouts span sizes; an em dash where the
                figure is not known yet, rather than an area of nothing. */}
            <span className="res__number" ref={figure}>
              {residence.area
                ? residence.areaMax
                  ? `${residence.area}–${residence.areaMax}`
                  : residence.area.toLocaleString('en-US')
                : '—'}
            </span>
            {residence.area > 0 && <span className="res__unit">{residence.unit}</span>}
          </p>
          <p className="res__caption">
            {residence.areaMax ? 'range of interior areas' : 'total interior area'}
          </p>
        </div>
      </aside>
    </div>
  );
}
