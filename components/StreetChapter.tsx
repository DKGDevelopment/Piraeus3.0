'use client';

import SequenceCanvas from './SequenceCanvas';
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
    <SequenceCanvas config={STREET_SEQUENCE} scrollLength={4} preload="near" />
  );
}
