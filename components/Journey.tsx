'use client';

import { useCallback, useEffect, useState } from 'react';
import Stage from './Stage';
import SequenceLayer from './SequenceLayer';
import Intro from './Intro';
import Stats from './Stats';
import BuildingLabels from './BuildingLabels';
import ChapterSpots from './ChapterSpots';
import TurnCue from './TurnCue';
import { HERO_SEQUENCE, STREET_SEQUENCE, LANE_SEQUENCE } from '@/lib/sequence';
import { LANE_SPOTS } from '@/lib/buildings';
import { FRAMES_TO_START } from '@/lib/useImageSequence';
import { lockScroll, unlockScroll } from '@/lib/lenis';

/**
 * The homepage journey: the descent, the street it lands on, and the lane off
 * it — laid end to end on one pinned stage so they hand over in place.
 *
 * Offsets are cumulative viewport heights: 0-4 descent, 4-8 street, 8-12 lane.
 */
const DESCENT = 4;
const STREET = 4;
const LANE = 4;
const STREET_AT = DESCENT;
const LANE_AT = DESCENT + STREET;
const TOTAL = DESCENT + STREET + LANE;

export default function Journey() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);

  const handleProgress = useCallback((p: number) => setProgress(p), []);
  const handleReady = useCallback(() => setReady(true), []);
  const handleEnter = useCallback(() => setEntered(true), []);

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

      <Stage length={TOTAL}>
        <SequenceLayer
          config={HERO_SEQUENCE}
          offset={0}
          length={DESCENT}
          onProgress={handleProgress}
          onReady={handleReady}
        >
          <BuildingLabels />
          <div className="hero__overlay">
            <h1 className="hero__title">
              A New Entrance<br />to Piraeus
            </h1>
            {entered && <Stats />}
            <p className="hero__scroll-cue">Scroll to descend</p>
          </div>
        </SequenceLayer>

        <SequenceLayer config={STREET_SEQUENCE} offset={STREET_AT} length={STREET}>
          <TurnCue
            label="Explore the lane"
            target={LANE_AT}
            from={{ x: 0.155, y: 0.625 }}
            to={{ x: 0.200, y: 0.605 }}
            enter={0.55}
          />
        </SequenceLayer>

        <SequenceLayer config={LANE_SEQUENCE} offset={LANE_AT} length={LANE}>
          <ChapterSpots spots={LANE_SPOTS} />
        </SequenceLayer>
      </Stage>
    </>
  );
}
