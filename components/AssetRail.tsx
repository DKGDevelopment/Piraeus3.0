'use client';

import Link from 'next/link';

/**
 * The fixed left rail.
 *
 * Transparent over the opening film so nothing sits between the visitor and the
 * shot, then filled once the deck starts moving — by which point it is over
 * content rather than imagery, and needs its own ground to read against.
 */
export default function AssetRail({ filled }: { filled: boolean }) {
  return (
    <aside className={`rail${filled ? ' rail--filled' : ''}`}>
      <div className="rail__top">
        <button type="button" className="rail__menu">
          Menu
        </button>
        <Link href="/contact" className="rail__enquire">
          Enquire
        </Link>
      </div>

      <div className="rail__bottom">
        <Link href="/" className="rail__home" aria-label="Back to the masterplan">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="rail__icon">
            <path
              d="M4 5h16v11H9l-5 4V5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <img className="rail__mark" src="/brand/logo-pg.png" alt="Piraeus Gate" />
      </div>
    </aside>
  );
}
