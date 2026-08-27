'use client';

import SequenceCanvas from './SequenceCanvas';
import TurnCue from './TurnCue';
import { STREET_SEQUENCE } from '@/lib/sequence';

/**
 * Chapter two. Its first frame is where the descent lands, so the two pin
 * back-to-back and read as one continuous move rather than a cut.
 *
 * Loaded lazily: downloading it alongside the descent would double what a
 * visitor waits for before anything moves.
 */
export default function StreetChapter() {
  return (
    <SequenceCanvas config={STREET_SEQUENCE} scrollLength={4} preload="near">
      <TurnCue
        label="Explore the lane"
        target="lane"
        from={{ x: 0.155, y: 0.625 }}
        to={{ x: 0.200, y: 0.605 }}
        enter={0.55}
      />
    </SequenceCanvas>
  );
}
