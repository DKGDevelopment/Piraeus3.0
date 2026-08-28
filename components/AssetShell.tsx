'use client';

import { useCallback, useState } from 'react';
import HorizontalDeck from './HorizontalDeck';
import AssetRail from './AssetRail';

/**
 * An asset page: a fixed rail and a deck of panels that travel sideways.
 *
 * The rail's fill is driven from the deck's own progress rather than a scroll
 * listener of its own, so the two can never disagree about whether the page has
 * started moving.
 */
export default function AssetShell({
  children,
  /**
   * The rail is transparent over a film so nothing sits between the visitor and
   * the shot. Over a cream opening panel there is no shot to protect, and a
   * transparent rail would be invisible against it.
   */
  filledFromStart = false,
}: {
  children: React.ReactNode;
  filledFromStart?: boolean;
}) {
  const [moved, setMoved] = useState(false);

  // A hair of travel, not zero: a resting page should read as untouched, but
  // the fill should arrive as soon as the visitor actually moves.
  const handleProgress = useCallback((p: number) => setMoved(p > 0.005), []);
  const filled = filledFromStart || moved;

  return (
    <>
      <AssetRail filled={filled} />
      <HorizontalDeck onProgress={handleProgress}>{children}</HorizontalDeck>
    </>
  );
}
