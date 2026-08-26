'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useImageSequence } from '@/lib/useImageSequence';
import { MAX_DPR, type SequenceConfig } from '@/lib/sequence';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  config: SequenceConfig;
  /** How many viewport heights of scroll the sequence is stretched across. */
  scrollLength?: number;
  onProgress?: (p: number) => void;
  onReady?: () => void;
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
  children,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frames, progress, ready } = useImageSequence(config);
  const frameIndex = useRef({ i: 0 });

  useEffect(() => {
    onProgress?.(progress);
  }, [progress, onProgress]);

  useGSAP(
    () => {
      if (!ready) return;
      onReady?.();

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { alpha: false })!;
      // Frames are cover-fitted, so most viewports scale them slightly. High-
      // quality resampling costs little at this frame rate and visibly helps.
      ctx.imageSmoothingQuality = 'high';

      const render = () => {
        const img = frames[Math.round(frameIndex.current.i)];
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

      return () => window.removeEventListener('resize', resize);
    },
    { scope: wrapRef, dependencies: [ready, config.frameCount, scrollLength] }
  );

  return (
    <div ref={wrapRef} className="sequence">
      <canvas ref={canvasRef} className="sequence__canvas" aria-hidden="true" />
      {children}
    </div>
  );
}
