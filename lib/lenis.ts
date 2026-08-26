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
