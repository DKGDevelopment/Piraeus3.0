'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Stage from './Stage';
import SequenceLayer from './SequenceLayer';
import Intro from './Intro';
import Stats from './Stats';
import ScrollCue from './ScrollCue';
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
import { jumpToY, lockScroll, unlockScroll } from '@/lib/lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

  // The cue is dismissed by the act it asks for, so it listens for the first
  // scroll rather than counting down.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!entered || scrolled) return;
    const onScroll = () => window.scrollY > 8 && setScrolled(true);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [entered, scrolled]);

  const tail = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);

  // Past the last chapter the journey returns to the aerial rather than running
  // out onto empty page. The stage starts at the top of the document, so the
  // return is a jump to zero — taken behind a brief blackout, because the cut
  // from the courtyard back to the aerial is the one moment in the journey that
  // is not a continuous move.
  useGSAP(() => {
    const st = ScrollTrigger.create({
      trigger: tail.current,
      start: 'top 55%',
      onEnter: () => {
        gsap
          .timeline()
          .to(veil.current, { autoAlpha: 1, duration: 0.32, ease: 'power2.in' })
          .add(() => {
            jumpToY(0);
            ScrollTrigger.update();
          })
          .to(veil.current, { autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, '+=0.08');
      },
    });
    return () => st.kill();
  }, []);

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

      <ScrollCue shown={entered} leaving={scrolled} />

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

      {/* Scroll room past the stage: entering it is what asks for the loop. */}
      <div ref={tail} className="loop-tail" aria-hidden="true" />
      <div ref={veil} className="loop-veil" aria-hidden="true" />
    </>
  );
}
