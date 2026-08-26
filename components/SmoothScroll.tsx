'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { setLenis } from '@/lib/lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Drives Lenis inertial scrolling from GSAP's ticker so ScrollTrigger and the
 * smoothing layer share a single clock (no drift, no double rAF).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // GSAP's lag correction jumps the playhead after a dropped frame, which on a
    // scrubbed sequence reads as the camera teleporting.
    gsap.ticker.lagSmoothing(0);

    return () => {
      setLenis(null);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
