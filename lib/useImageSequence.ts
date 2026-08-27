'use client';

import { useEffect, useRef, useState } from 'react';
import { framePath, pickTier, type SequenceConfig, type SequenceTier } from './sequence';

type Loaded = {
  frames: (HTMLImageElement | null)[];
  /** Fraction of the whole sequence loaded, for the background indicator. */
  progress: number;
  /** Enough of the opening is loaded to start scrubbing. */
  ready: boolean;
  /** Every frame is in; no more fallback to an earlier frame can occur. */
  complete: boolean;
  tier: SequenceTier | null;
};

/**
 * Frames needed before the sequence can start. Loading runs roughly in order
 * and people scroll forward, so the rest arrives ahead of the playhead instead
 * of holding the whole page behind a full download.
 */
export const FRAMES_TO_START = 20;

/**
 * Preloads a frame sequence with bounded concurrency, releasing the page once
 * the opening frames are in and continuing in the background. The tier is
 * resolved once on mount: re-picking on resize would restart a large download
 * mid-scroll, and the canvas cover-fit already handles viewport changes.
 */
export function useImageSequence(
  cfg: SequenceConfig,
  { enabled = true, concurrency = 8 }: { enabled?: boolean; concurrency?: number } = {}
): Loaded {
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(cfg.frameCount).fill(null)
  );
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);
  const [tier, setTier] = useState<SequenceTier | null>(null);

  useEffect(() => {
    if (!enabled) return;
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
            if (done >= Math.min(FRAMES_TO_START, cfg.frameCount)) setReady(true);
          }
          resolve();
        };
        img.onload = finish;
        // A missing frame must not deadlock the loader.
        img.onerror = () => {
          done += 1;
          if (!cancelled) {
            setProgress(done / cfg.frameCount);
            if (done >= Math.min(FRAMES_TO_START, cfg.frameCount)) setReady(true);
          }
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
      if (!cancelled) setComplete(true);
    });

    return () => {
      cancelled = true;
    };
  }, [cfg, concurrency, enabled]);

  return { frames: framesRef.current, progress, ready, complete, tier };
}
