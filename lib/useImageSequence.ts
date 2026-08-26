'use client';

import { useEffect, useRef, useState } from 'react';
import { framePath, pickTier, type SequenceConfig, type SequenceTier } from './sequence';

type Loaded = {
  frames: (HTMLImageElement | null)[];
  progress: number;
  ready: boolean;
  tier: SequenceTier | null;
};

/**
 * Preloads a frame sequence with bounded concurrency and reports progress so the
 * page can hold a loader until the animation can run without stutter. The tier
 * is resolved once on mount: re-picking on resize would restart a 20MB download
 * mid-scroll, and the canvas cover-fit already handles viewport changes.
 */
export function useImageSequence(cfg: SequenceConfig, concurrency = 8): Loaded {
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(cfg.frameCount).fill(null)
  );
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [tier, setTier] = useState<SequenceTier | null>(null);

  useEffect(() => {
    let cancelled = false;
    const resolved = pickTier(cfg, window.innerWidth, window.devicePixelRatio || 1);
    setTier(resolved);

    let done = 0;
    let next = 0;

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = framePath(resolved, cfg.ext, i);
        const finish = () => {
          if (!cancelled) {
            framesRef.current[i] = img;
            done += 1;
            setProgress(done / cfg.frameCount);
          }
          resolve();
        };
        img.onload = finish;
        // A missing frame must not deadlock the loader.
        img.onerror = () => {
          done += 1;
          if (!cancelled) setProgress(done / cfg.frameCount);
          resolve();
        };
      });

    const worker = async () => {
      while (!cancelled && next < cfg.frameCount) {
        await loadOne(next++);
      }
    };

    Promise.all(
      Array.from({ length: Math.min(concurrency, cfg.frameCount) }, worker)
    ).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [cfg, concurrency]);

  return { frames: framesRef.current, progress, ready, tier };
}
