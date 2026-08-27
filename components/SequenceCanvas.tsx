'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useImageSequence } from '@/lib/useImageSequence';
import BuildingLabels from './BuildingLabels';
import { MAX_DPR, type SequenceConfig } from '@/lib/sequence';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  config: SequenceConfig;
  /** How many viewport heights of scroll the sequence is stretched across. */
  scrollLength?: number;
  onProgress?: (p: number) => void;
  onReady?: () => void;
  /** Overlay the asset callouts tethered to their roofs. */
  labels?: boolean;
  /**
   * 'eager' downloads immediately; 'near' waits until the chapter is about a
   * viewport away, so a later chapter does not compete with the one on screen.
   */
  preload?: 'eager' | 'near';
  children?: React.ReactNode;
};

/**
 * Pins a full-bleed canvas and scrubs a pre-rendered frame sequence against
 * scroll position. Frames are drawn with cover-fit so any viewport aspect ratio
 * keeps the masterplan centred.
 */
export default function SequenceCanvas({
  config,
  scrollLength = 4,
  onProgress,
  onReady,
  labels = false,
  preload = 'eager',
  children,
}: Props) {
  const [armed, setArmed] = useState(preload === 'eager');
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frames, progress, ready, tier } = useImageSequence(config, { enabled: armed });
  const frameIndex = useRef({ i: 0 });
  const renderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (armed || !wrapRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setArmed(true),
      { rootMargin: '100% 0px' }
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [armed]);

  useEffect(() => {
    if (ready) onReady?.();
  }, [ready, onReady]);

  useEffect(() => {
    onProgress?.(progress);
    // A frame the playhead already passed may have only just arrived; redraw so
    // it replaces the fallback that was standing in for it.
    renderRef.current?.();
  }, [progress, onProgress]);

  useGSAP(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { alpha: false })!;
      // Frames are cover-fitted, so most viewports scale them slightly. High-
      // quality resampling costs little at this frame rate and visibly helps.
      ctx.imageSmoothingQuality = 'high';

      const render = () => {
        const want = Math.round(frameIndex.current.i);
        // Loading runs ahead of the playhead, but a fast scroll can outrun it.
        // Fall back to the nearest earlier frame rather than dropping a draw,
        // so the descent stutters instead of going blank.
        let img = frames[want];
        for (let i = want - 1; !img && i >= 0; i--) img = frames[i];
        if (!img) return;
        const { width: cw, height: ch } = canvas;
        const scale = Math.max(cw / img.width, ch / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        render();
      };

      resize();
      renderRef.current = render;
      window.addEventListener('resize', resize);

      // Created inside useGSAP's context, so it is reverted automatically on
      // unmount and on Strict Mode's double-invoke.
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: `+=${scrollLength * 100}%`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          frameIndex.current.i = self.progress * (config.frameCount - 1);
          render();
        },
      });

      return () => {
        renderRef.current = null;
        window.removeEventListener('resize', resize);
      };
    },
    // The pin is created on mount rather than when frames arrive: adding 400vh
    // of pinned scroll to the page mid-scroll would jolt the reader.
    { scope: wrapRef, dependencies: [config.frameCount, scrollLength] }
  );

  return (
    <div ref={wrapRef} className="sequence">
      <canvas ref={canvasRef} className="sequence__canvas" aria-hidden="true" />
      {labels && ready && tier && (
        <BuildingLabels tier={tier} scrollLength={scrollLength} triggerRef={wrapRef} />
      )}
      {children}
    </div>
  );
}
