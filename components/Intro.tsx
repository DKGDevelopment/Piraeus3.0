'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type Props = {
  /** 0-1 toward the frames needed before the sequence can start. */
  progress: number;
  /** The sequence can start; the gate may be opened. */
  armed: boolean;
  onEnter: () => void;
};

/**
 * The opening gate: a still aerial plate carrying the project wordmark, held
 * until the visitor chooses to enter. It paints in a fraction of the time the
 * frame sequence needs, so the site is never a black screen behind a loader —
 * and the seconds a visitor spends here are seconds the sequence spends loading.
 *
 * The plate is a wider view than the sequence opens on, so leaving is a push
 * inward rather than a cut: the plate scales up as it fades, arriving at the
 * sequence's framing.
 */
export default function Intro({ progress, armed, onEnter }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);

  const { contextSafe } = useGSAP({ scope: root });

  const handleEnter = contextSafe(() => {
    if (!armed || leaving.current) return;
    leaving.current = true;

    gsap
      .timeline({ onComplete: onEnter })
      .to('.intro__content', { opacity: 0, y: -12, duration: 0.5, ease: 'power2.in' })
      .to('.intro__plate', { scale: 1.18, duration: 1.5, ease: 'power2.inOut' }, 0)
      .to(root.current, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0.35);
  });

  return (
    <div ref={root} className="intro">
      <picture>
        <source
          srcSet="/plate/gate-1280.webp 1280w, /plate/gate-1920.webp 1920w, /plate/gate-2560.webp 2560w"
          sizes="100vw"
          type="image/webp"
        />
        <img
          className="intro__plate"
          src="/plate/gate-1920.webp"
          alt="Aerial view of the Piraeus Gate development and the port beyond"
          fetchPriority="high"
        />
      </picture>

      <div className="intro__scrim" />

      {/* The wordmark is the control: the visitor clicks the logo to enter. */}
      <button
        type="button"
        className={`intro__content${armed ? ' is-armed' : ''}`}
        onClick={handleEnter}
        disabled={!armed}
        aria-label={armed ? 'Enter Piraeus Gate' : 'Preparing the experience'}
      >
        <img className="intro__logo" src="/brand/logo-pg.png" alt="Piraeus Gate" />

        <span className="intro__enter">
          <span className="intro__enter-label">{armed ? 'Enter' : 'Preparing'}</span>
          <span className="intro__enter-track">
            <span
              className="intro__enter-fill"
              style={{ transform: `scaleX(${armed ? 1 : progress})` }}
            />
          </span>
        </span>
      </button>
    </div>
  );
}
