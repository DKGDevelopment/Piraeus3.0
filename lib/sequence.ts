/**
 * Registry for scroll-driven image sequences.
 *
 * Frames are exported from the rendered camera move at intervals of equal
 * cumulative motion rather than equal time. Apparent motion accelerates as the
 * camera closes on the development, so even time sampling would spend frames on
 * the slow opening and skip through the fast ending. Motion-equalised sampling
 * makes a linear scroll produce a constant perceived speed.
 */
/** Beyond 2x the fill-rate cost outweighs the visible gain. */
export const MAX_DPR = 2;

export type SequenceTier = {
  id: string;
  width: number;
  height: number;
};

export type SequenceConfig = {
  frameCount: number;
  ext: 'webp' | 'avif' | 'jpg';
  /** Ascending by width. */
  tiers: SequenceTier[];
};

export const HERO_SEQUENCE: SequenceConfig = {
  frameCount: 126,
  ext: 'webp',
  tiers: [
    { id: 'hero-sm', width: 1080, height: 608 },
    { id: 'hero', width: 1920, height: 1080 },
    { id: 'hero-xl', width: 2560, height: 1440 },
  ],
};

/**
 * Smallest tier that covers the canvas at its real backing-store width, falling
 * back to the largest. The canvas caps DPR at 2, so this must match that cap:
 * asking for less means the browser upscales every frame and the sequence reads
 * soft, which is the most visible quality loss in the whole pipeline.
 */
export function pickTier(cfg: SequenceConfig, viewportWidth: number, dpr: number): SequenceTier {
  const needed = viewportWidth * Math.min(Math.max(dpr, 1), MAX_DPR);
  return cfg.tiers.find((t) => t.width >= needed) ?? cfg.tiers[cfg.tiers.length - 1];
}

export function framePath(tier: SequenceTier, ext: string, index: number): string {
  const n = String(index + 1).padStart(4, '0');
  return `/sequence/${tier.id}/${tier.id}_${n}.${ext}`;
}
