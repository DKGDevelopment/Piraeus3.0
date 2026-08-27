'use client';

import { createContext } from 'react';
import type { SequenceConfig, SequenceTier } from './sequence';

/**
 * A chapter of the journey. `length` is in viewport heights of scroll, and
 * chapters are laid end to end inside one pinned stage.
 */
export type Chapter = {
  id: string;
  config: SequenceConfig;
  length: number;
};

/** Broadcast of the stage's single playhead, in viewport-height units. */
export const StageScrub = createContext<{
  subscribe: (fn: (travelled: number) => void) => () => void;
  /** Scrolls so a chapter's start sits at the top of the stage. */
  goTo: (offset: number) => void;
} | null>(null);

/** A layer's own progress, for overlays anchored to its frames. */
export const SequenceScrub = createContext<{
  subscribe: (fn: (p: number) => void) => () => void;
  tier: SequenceTier | null;
} | null>(null);

export type { SequenceConfig };
