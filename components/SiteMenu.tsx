'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export const MENU = [
  { label: 'Home', href: '/', image: '/video/skyblue-poster.webp' },
  { label: 'Team', href: '/team', image: '/plate/team-menu.webp' },
  { label: 'News', href: '/news', image: '/plate/news-menu.webp' },
  { label: 'Masterplan', href: '/masterplan', image: '/plate/masterplan-menu.webp' },
];

/**
 * The full-bleed tile menu, shared by every entry point (the asset rail, the
 * homepage). Always mounted by its caller and revealed via `.menu--open`
 * rather than conditional mounting — a new sibling inserted next to a pinned
 * ScrollTrigger element breaks React's reconciliation.
 */
export default function SiteMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`menu${open ? ' menu--open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu">
      <div className="menu__side">
        <div className="menu__side-top">
          <button type="button" className="menu__close" onClick={onClose}>
            Close
          </button>
          <Link className="rail__enquire" href="/contact" onClick={onClose}>
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
          <Link key={item.href} href={item.href} className="tile" onClick={onClose}>
            <span className="tile__label">{item.label}</span>
            <span className="tile__img" style={{ backgroundImage: `url(${item.image})` }} />
          </Link>
        ))}
      </nav>
    </div>
  );
}
