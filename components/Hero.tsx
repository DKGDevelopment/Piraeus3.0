'use client';

import { useCallback, useState } from 'react';
import SequenceCanvas from './SequenceCanvas';
import Loader from './Loader';
import { HERO_SEQUENCE } from '@/lib/sequence';

/**
 * Step 1: the establishing shot. Scroll drives a camera move from the wide
 * aerial of the masterplan down toward the district. Building-level hotspots
 * and the deeper zoom stages land in later steps.
 */
export default function Hero() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const handleProgress = useCallback((p: number) => setProgress(p), []);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <>
      <Loader progress={progress} done={ready} />
      <SequenceCanvas
        config={HERO_SEQUENCE}
        scrollLength={4}
        onProgress={handleProgress}
        onReady={handleReady}
      >
        <div className="hero__overlay">
          <h1 className="hero__title">
            A new waterfront<br />for Piraeus
          </h1>
          <p className="hero__scroll-cue">Scroll to descend</p>
        </div>
      </SequenceCanvas>
    </>
  );
}
