'use client';

import SequenceCanvas from './SequenceCanvas';
import { LANE_SEQUENCE } from '@/lib/sequence';

/** Chapter three: the pedestrian lane, reached by the turn on the street. */
export default function LaneChapter() {
  return (
    <SequenceCanvas
      id="lane"
      config={LANE_SEQUENCE}
      scrollLength={4}
      preload="near"
    />
  );
}
