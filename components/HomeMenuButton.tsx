'use client';

import { useState } from 'react';
import SiteMenu from './SiteMenu';

/**
 * A menu button for the homepage, which carries no rail of its own. Hidden
 * until the descent finishes — appearing over the aerial would compete with
 * the wordmark and stats it's still revealing — then sits top-left for the
 * rest of the journey.
 *
 * Always mounted, revealed via a CSS class: the stage beneath is pinned by
 * ScrollTrigger, and mounting a new sibling after the fact breaks React's
 * reconciliation against GSAP's spacer div.
 */
export default function HomeMenuButton({ shown }: { shown: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`home-menu${shown ? ' home-menu--shown' : ''}`}
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        <svg className="home-menu__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Menu
      </button>
      <SiteMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
