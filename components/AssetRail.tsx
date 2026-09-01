'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteMenu from './SiteMenu';

/**
 * The fixed left rail.
 *
 * Transparent over the opening film so nothing sits between the visitor and the
 * shot, then filled once the deck starts moving — by which point it is over
 * content rather than imagery, and needs its own ground to read against.
 */
export default function AssetRail({ filled }: { filled: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <aside className={`rail${filled ? ' rail--filled' : ''}`}>
      <div className="rail__top">
        <button
          type="button"
          className="rail__menu"
          onClick={() => setOpen(true)}
          aria-expanded={open}
        >
          Menu
        </button>
        <Link href="/contact" className="rail__enquire">
          Enquire
        </Link>
      </div>

      <Link href="/" className="rail__bottom" aria-label="Back to the masterplan">
        <img className="rail__mark" src="/brand/logo-pg-stacked.png" alt="Piraeus Gate" />
      </Link>

      {/* Rendered from the rail rather than beside the deck: the deck is pinned,
          and a sibling inserted next to a pinned element breaks reconciliation. */}
      <SiteMenu open={open} onClose={() => setOpen(false)} />
    </aside>
  );
}
