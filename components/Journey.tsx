'use client';

import { useCallback, useEffect, useState } from 'react';
import Stage from './Stage';
import SequenceLayer from './SequenceLayer';
import Intro from './Intro';
import Stats from './Stats';
import BuildingLabels from './BuildingLabels';
import ChapterSpots from './ChapterSpots';
import TurnCue from './TurnCue';
import {
  HERO_SEQUENCE,
  STREET_SEQUENCE,
  COURT_SEQUENCE,
  LANE_SEQUENCE,
} from '@/lib/sequence';
import { COURT_SPOTS, LANE_SPOTS } from '@/lib/buildings';
import { FRAMES_TO_START } from '@/lib/useImageSequence';
import { lockScroll, unlockScroll } from '@/lib/lenis';

/**
 * The homepage journey: the descent, the street it lands on, the courtyard
 * behind it and the lane beyond — laid end to end on one pinned stage so they
 * hand over in place.
 *
 * Offsets are cumulative viewport heights, derived from the lengths rather than
 * written out, so inserting a chapter moves the later ones without any of them
 * being retuned by hand.
 */
const DESCENT = 4;
const STREET = 4;
const COURT = 3.5;
const LANE = 4;
const STREET_AT = DESCENT;
const COURT_AT = STREET_AT + STREET;
const LANE_AT = COURT_AT + COURT;
const TOTAL = LANE_AT + LANE;

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
            label="Explore the courtyard"
            target={COURT_AT}
            from={{ x: 0.155, y: 0.625 }}
            to={{ x: 0.200, y: 0.605 }}
            enter={0.55}
          />
        </SequenceLayer>

        <SequenceLayer config={COURT_SEQUENCE} offset={COURT_AT} length={COURT}>
          <ChapterSpots spots={COURT_SPOTS} />
        </SequenceLayer>

        <SequenceLayer config={LANE_SEQUENCE} offset={LANE_AT} length={LANE}>
          <ChapterSpots spots={LANE_SPOTS} />
        </SequenceLayer>
      </Stage>
    </>
  );
}
