'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SequenceScrub, StageScrub } from '@/lib/stage';
import type { SequenceTier } from '@/lib/sequence';

type Props = {
  /** CDN URL of the source video. */
  src: string;
  poster?: string;
  /** Native encode dimensions, used for the cover-fit math overlays rely on. */
  width: number;
  height: number;
  /** Where this chapter starts on the stage playhead, in viewport heights. */
  offset: number;
  /** How much scroll it occupies, in viewport heights. */
  length: number;
  onProgress?: (p: number) => void;
  onReady?: () => void;
  children?: React.ReactNode;
};

/** Seconds of playback that must be buffered before scrubbing may begin. */
const BUFFER_TO_START = 2;

/**
 * A chapter driven by seeking a single video rather than drawing a frame
 * sequence: the stage playhead maps onto the clip's currentTime. One
 * continuous stream beats hundreds of image requests for load smoothness,
 * and CBR-encoded footage seeks predictably enough for scroll scrubbing.
 *
 * Shares SequenceLayer's contract (offset/length/onProgress/onReady, plus
 * the SequenceScrub context overlays read `tier` from) so it drops into the
 * same chapter slot in the stage.
 */
export default function VideoSequenceLayer({
  src,
  poster,
  width,
  height,
  offset,
  length,
  onProgress,
  onReady,
  children,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stage = useContext(StageScrub);

  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const local = useRef<Set<(p: number) => void>>(new Set());
  const lastLocal = useRef(0);

  const subscribe = useRef((fn: (p: number) => void) => {
    fn(lastLocal.current);
    local.current.add(fn);
    return () => {
      local.current.delete(fn);
    };
  }).current;

  const tier: SequenceTier = useMemo(() => ({ id: 'hero-video', width, height }), [width, height]);
  const scrubContext = useMemo(() => ({ subscribe, tier }), [subscribe, tier]);

  useEffect(() => {
    if (ready) onReady?.();
  }, [ready, onReady]);

  useGSAP(
    () => {
      const video = videoRef.current!;
      let duration = 0;
      let lastSetTime = -1;

      // Some WebM muxes omit a duration header, leaving video.duration as
      // Infinity (truthy, so an unguarded check on it silently breaks
      // seeking) until playback has reached the end once. Forcing a seek
      // near the end makes the browser compute the real duration, reported
      // through 'durationchange'; we then return to the start.
      const resolveDuration = () => {
        if (Number.isFinite(video.duration) && video.duration > 0 && video.duration !== duration) {
          duration = video.duration;
          // A forced seek used to discover the duration (or one made before
          // this ran) may have left currentTime away from the playhead;
          // snap back to wherever the scroll position actually is.
          const t = lastLocal.current * duration;
          video.currentTime = t;
          lastSetTime = t;
        } else if (video.readyState >= 1 && !Number.isFinite(video.duration)) {
          video.currentTime = 1e101;
        }
      };

      const updateBuffered = () => {
        if (!video.buffered.length) return;
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        if (duration) onProgress?.(gsap.utils.clamp(0, 1, bufferedEnd / duration));
        if (!readyRef.current && bufferedEnd >= Math.min(BUFFER_TO_START, duration || BUFFER_TO_START)) {
          readyRef.current = true;
          setReady(true);
        }
      };

      video.addEventListener('loadedmetadata', resolveDuration);
      video.addEventListener('durationchange', resolveDuration);
      video.addEventListener('progress', updateBuffered);
      video.addEventListener('canplaythrough', updateBuffered);

      // The video can already have metadata and buffered data by the time
      // this effect runs — a cached response, a fast CDN edge, or simply
      // React getting to this effect after the browser already fired the
      // events above. Those events don't replay for a listener attached
      // late, so the element's current state has to be checked directly too,
      // or a fast-loading video permanently gets stuck unscrubbable.
      resolveDuration();
      updateBuffered();

      const onStage = (travelled: number) => {
        const p = gsap.utils.clamp(0, 1, (travelled - offset) / length);
        lastLocal.current = p;

        // Painted only while the playhead is inside this chapter, same as the
        // image-sequence chapters it sits alongside.
        const inside = travelled >= offset && travelled <= offset + length;
        gsap.set(root.current, { autoAlpha: inside ? 1 : 0 });

        if (duration > 0 && Number.isFinite(duration)) {
          const t = p * duration;
          // Skip redundant seeks below a frame's worth of movement — every
          // write to currentTime is a potential network fetch on remote video.
          if (Math.abs(t - lastSetTime) > 1 / 60) {
            video.currentTime = t;
            lastSetTime = t;
          }
        }

        for (const fn of local.current) fn(p);
      };

      const unsubscribe = stage?.subscribe(onStage);

      return () => {
        unsubscribe?.();
        video.removeEventListener('loadedmetadata', resolveDuration);
        video.removeEventListener('durationchange', resolveDuration);
        video.removeEventListener('progress', updateBuffered);
        video.removeEventListener('canplaythrough', updateBuffered);
      };
    },
    { scope: root, dependencies: [stage, offset, length] }
  );

  return (
    <div ref={root} className="layer">
      <video
        ref={videoRef}
        className="layer__video"
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <SequenceScrub.Provider value={scrubContext}>{children}</SequenceScrub.Provider>
    </div>
  );
}
