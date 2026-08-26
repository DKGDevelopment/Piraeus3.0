/**
 * Building callouts over the hero descent.
 *
 * Anchors are in normalised frame space (0-1 across the rendered frame, not the
 * viewport) because the canvas cover-fits: the same anchor lands on the same
 * roof at any window aspect. The camera pushes in over the sequence, so each
 * anchor is given its position at the first and last frame and interpolated
 * between — the move is smooth enough that a straight line tracks it closely.
 *
 * `label` is the offset from the anchor to the text block, in the same space,
 * and the leader line is drawn between them.
 */
export type Building = {
  id: string;
  name: string;
  /** Anchor on the first frame. */
  from: { x: number; y: number };
  /** Anchor on the last frame. */
  to: { x: number; y: number };
  /** Text block offset from the anchor. */
  label: { x: number; y: number };
  /** Scrub progress at which the callout fades in. */
  enter: number;
};

export const BUILDINGS: Building[] = [
  {
    id: 'skyway',
    name: 'Skyway',
    from: { x: 0.217, y: 0.499 },
    to: { x: 0.050, y: 0.370 },
    label: { x: -0.070, y: -0.140 },
    enter: 0.10,
  },
  {
    id: 'skyblue',
    name: 'Skyblue',
    from: { x: 0.325, y: 0.622 },
    to: { x: 0.187, y: 0.533 },
    label: { x: -0.030, y: -0.185 },
    enter: 0.14,
  },
  {
    id: 'greater',
    name: 'Piraeus Greater Apartments',
    from: { x: 0.524, y: 0.536 },
    to: { x: 0.534, y: 0.384 },
    label: { x: 0.085, y: -0.120 },
    enter: 0.18,
  },
  {
    id: 'gateway',
    name: 'Gateway Business Hub',
    from: { x: 0.427, y: 0.719 },
    to: { x: 0.360, y: 0.711 },
    label: { x: -0.150, y: -0.055 },
    enter: 0.22,
  },
  {
    id: 'urban',
    name: 'Urban GL',
    from: { x: 0.529, y: 0.800 },
    to: { x: 0.542, y: 0.852 },
    label: { x: 0.075, y: 0.115 },
    enter: 0.26,
  },
  {
    id: 'nexus',
    name: 'S&S Nexus',
    from: { x: 0.688, y: 0.719 },
    to: { x: 0.813, y: 0.726 },
    label: { x: 0.115, y: -0.130 },
    enter: 0.30,
  },
];

/** Anchor position on the frame at a given scrub progress. */
export function anchorAt(b: Building, p: number) {
  return {
    x: b.from.x + (b.to.x - b.from.x) * p,
    y: b.from.y + (b.to.y - b.from.y) * p,
  };
}

/**
 * Maps normalised frame space to viewport pixels using the same cover-fit the
 * canvas draws with, so callouts stay locked to their roofs at any aspect.
 */
export function coverFit(
  frameW: number,
  frameH: number,
  viewW: number,
  viewH: number
) {
  const scale = Math.max(viewW / frameW, viewH / frameH);
  const w = frameW * scale;
  const h = frameH * scale;
  const offsetX = (viewW - w) / 2;
  const offsetY = (viewH - h) / 2;
  return (nx: number, ny: number) => ({
    x: offsetX + nx * w,
    y: offsetY + ny * h,
  });
}
