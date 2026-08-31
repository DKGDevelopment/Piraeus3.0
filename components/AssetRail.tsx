'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * The fixed left rail.
 *
 * Transparent over the opening film so nothing sits between the visitor and the
 * shot, then filled once the deck starts moving — by which point it is over
 * content rather than imagery, and needs its own ground to read against.
 */
/**
 * Menu destinations. Imagery is drawn from what the site already has; Team and
 * News carry an interior each until they have pictures of their own.
 */
const MENU = [
  { label: 'Home', href: '/', image: '/video/skyblue-poster.webp' },
  { label: 'Team', href: '/team', image: '/residences/skyblue-3.webp' },
  { label: 'News', href: '/news', image: '/residences/greater-3.webp' },
  { label: 'Masterplan', href: '/masterplan', image: '/plate/gate-1280.webp' },
];

export default function AssetRail({ filled }: { filled: boolean }) {
  const [open, setOpen] = useState(false);

  // Escape closes it, and the page beneath must not scroll while it is over it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

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
      <div
        className={`menu${open ? ' menu--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="menu__side">
          <div className="menu__side-top">
            <button
              type="button"
              className="menu__close"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <Link className="rail__enquire" href="/contact" onClick={() => setOpen(false)}>
              Enquire
            </Link>
          </div>

          <div className="menu__side-foot">
            <p className="menu__label">Contact details</p>
            <p className="menu__detail">Piraeus Gate, Piraeus</p>
            <p className="menu__label">Email</p>
            <p className="menu__detail">hello@piraeusgate.com</p>
            <p className="menu__label">Instagram</p>
            <p className="menu__detail">@piraeusgate</p>
            <img className="menu__mark" src="/brand/logo-pg-stacked.png" alt="Piraeus Gate" />
          </div>
        </div>

        <nav className="menu__tiles">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="tile"
              onClick={() => setOpen(false)}
            >
              <span
                className="tile__img"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <span className="tile__label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

    </aside>
  );
}
