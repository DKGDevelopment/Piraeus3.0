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

      <Link href="/" className="rail__bottom" aria-label="Back to the masterplan">
        <img className="rail__mark" src="/brand/logo-pg-stacked.png" alt="Piraeus Gate" />
      </Link>
    </aside>
  );
}
