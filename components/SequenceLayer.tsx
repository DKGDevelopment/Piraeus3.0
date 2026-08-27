'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useImageSequence } from '@/lib/useImageSequence';
import { SequenceScrub, StageScrub } from '@/lib/stage';
import { MAX_DPR, type SequenceConfig } from '@/lib/sequence';

type Props = {
  config: SequenceConfig;
  /** Where this chapter starts on the stage playhead, in viewport heights. */
  offset: number;
  /** How much scroll it occupies, in viewport heights. */
  length: number;
  onProgress?: (p: number) => void;
  onReady?: () => void;
  children?: React.ReactNode;
};

/**
 * One chapter's canvas within the stage. It maps the stage playhead onto its
 * own 0-1 progress and draws the matching frame.
 *
 * Layers are stacked, and a layer is only painted while the playhead is inside
 * it. The chapters were shot so each begins where the last ended, so the
 * handover is a straight swap with no dissolve — anything softer would read as
 * an edit between two shots meant to be one move.
 */
export default function SequenceLayer({
  config,
  offset,
  length,
  onProgress,
  onReady,
  children,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stage = useContext(StageScrub);

  const [armed, setArmed] = useState(offset === 0);
  const { frames, progress, ready, tier } = useImageSequence(config, { enabled: armed });

  const frameIndex = useRef({ i: 0 });
  const renderRef = useRef<(() => void) | null>(null);
  const local = useRef<Set<(p: number) => void>>(new Set());
  const lastLocal = useRef(0);

  const subscribe = useRef((fn: (p: number) => void) => {
    fn(lastLocal.current);
    local.current.add(fn);
    return () => {
      local.current.delete(fn);
    };
  }).current;

  const scrubContext = useMemo(() => ({ subscribe, tier }), [subscribe, tier]);

  useEffect(() => {
    if (ready) onReady?.();
  }, [ready, onReady]);

  useEffect(() => {
    onProgress?.(progress);
    renderRef.current?.();
  }, [progress, onProgress]);

  useGSAP(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { alpha: false })!;
      ctx.imageSmoothingQuality = 'high';

      const render = () => {
        const want = Math.round(frameIndex.current.i);
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

      const onStage = (travelled: number) => {
        const p = gsap.utils.clamp(0, 1, (travelled - offset) / length);
        lastLocal.current = p;

        // Arm a chapter's download about a viewport before it is reached, so a
        // later chapter never competes with the one on screen.
        if (!armed && travelled > offset - 1) setArmed(true);

        // Painted only while the playhead is inside this chapter. The last
        // chapter keeps its final frame so the stage does not go black as the
        // page continues past it.
        const inside = travelled >= offset && travelled <= offset + length;
        gsap.set(root.current, { autoAlpha: inside ? 1 : 0 });

        frameIndex.current.i = p * (config.frameCount - 1);
        render();
        for (const fn of local.current) fn(p);
      };

      const unsubscribe = stage?.subscribe(onStage);

      return () => {
        unsubscribe?.();
        renderRef.current = null;
        window.removeEventListener('resize', resize);
      };
    },
    { scope: root, dependencies: [stage, frames, config.frameCount, offset, length, armed] }
  );

  return (
    <div ref={root} className="layer">
      <canvas ref={canvasRef} className="layer__canvas" aria-hidden="true" />
      <SequenceScrub.Provider value={scrubContext}>{children}</SequenceScrub.Provider>
    </div>
  );
}
