'use client';

import { useCallback, useEffect, useState } from 'react';
import SequenceCanvas from './SequenceCanvas';
import Intro from './Intro';
import Stats from './Stats';
import { HERO_SEQUENCE } from '@/lib/sequence';
import { FRAMES_TO_START } from '@/lib/useImageSequence';
import { lockScroll, unlockScroll } from '@/lib/lenis';

/**
 * Step 1: the establishing shot. The intro plate holds the visitor while the
 * sequence loads behind it; entering hands off to a scroll-driven descent over
 * the district. Building-level hotspots land in later steps.
 */
export default function Hero() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);

  const handleProgress = useCallback((p: number) => setProgress(p), []);
  const handleReady = useCallback(() => setReady(true), []);
  const handleEnter = useCallback(() => setEntered(true), []);

  // The descent is the only thing to scroll, so scrolling before entering would
  // move the page behind the plate.
  useEffect(() => {
    if (entered) unlockScroll();
    else lockScroll();
    return unlockScroll;
  }, [entered]);

  return (
    <>
      {!entered && (
        <Intro
          progress={Math.min(1, (progress * HERO_SEQUENCE.frameCount) / FRAMES_TO_START)}
          armed={ready}
          onEnter={handleEnter}
        />
      )}
      <SequenceCanvas
        config={HERO_SEQUENCE}
        scrollLength={4}
        labels
        onProgress={handleProgress}
        onReady={handleReady}
      >
        <div className="hero__overlay">
          <h1 className="hero__title">
            A New Entrance<br />to Piraeus
          </h1>
          {entered && <Stats />}
          <p className="hero__scroll-cue">Scroll to descend</p>
        </div>
      </SequenceCanvas>
    </>
  );
}
