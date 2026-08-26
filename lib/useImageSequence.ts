'use client';

import { useEffect, useRef, useState } from 'react';
import { framePath, type SequenceConfig } from './sequence';

type Loaded = {
  frames: (HTMLImageElement | null)[];
  progress: number;
  ready: boolean;
};

/**
 * Preloads a frame sequence with bounded concurrency and reports progress so the
 * page can hold a loader until the animation can run without stutter.
 */
export function useImageSequence(cfg: SequenceConfig, concurrency = 8): Loaded {
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(cfg.frameCount).fill(null)
  );
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let done = 0;
    let next = 0;

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = framePath(cfg, i);
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
        const i = next++;
        await loadOne(i);
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

  return { frames: framesRef.current, progress, ready };
}
