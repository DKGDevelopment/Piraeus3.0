'use client';

import type Lenis from 'lenis';

/**
 * The single Lenis instance, shared so sections can suspend scrolling.
 * Lenis drives scrolling itself, so `overflow: hidden` alone does not stop it.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function lockScroll() {
  instance?.stop();
  document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
  document.documentElement.style.overflow = '';
  instance?.start();
}

/** Smooth-scrolls to an element, falling back to native when Lenis is off. */
export function scrollToEl(el: Element, duration = 1.6) {
  if (instance) instance.scrollTo(el as HTMLElement, { duration });
  else el.scrollIntoView({ behavior: 'smooth' });
}
