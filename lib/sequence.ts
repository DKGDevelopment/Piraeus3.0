/**
 * Central registry for scroll-driven image sequences.
 *
 * Each sequence is a folder of pre-rendered frames exported from the 3D suite.
 * Naming convention (zero-padded, 4 digits): /sequence/<id>/<id>_0001.webp
 */
export type SequenceConfig = {
  id: string;
  frameCount: number;
  /** Rendered pixel dimensions of a single frame. Used for cover-fit math. */
  width: number;
  height: number;
  ext: 'webp' | 'avif' | 'jpg';
};

export const HERO_SEQUENCE: SequenceConfig = {
  id: 'hero',
  // TODO: set to the real frame count once the render is delivered.
  frameCount: 120,
  width: 2560,
  height: 1440,
  ext: 'webp',
};

export function framePath(cfg: SequenceConfig, index: number): string {
  const n = String(index + 1).padStart(4, '0');
  return `/sequence/${cfg.id}/${cfg.id}_${n}.${cfg.ext}`;
}
