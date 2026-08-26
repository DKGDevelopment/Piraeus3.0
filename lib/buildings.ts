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
    from: { x: 0.197, y: 0.549 },
    to: { x: 0.128, y: 0.361 },
    label: { x: -0.070, y: -0.140 },
    enter: 0.06,
  },
  {
    id: 'skyblue',
    name: 'Skyblue',
    from: { x: 0.316, y: 0.631 },
    to: { x: 0.250, y: 0.493 },
    label: { x: -0.030, y: -0.170 },
    enter: 0.09,
  },
  {
    id: 'greater',
    name: 'Piraeus Greater Apartments',
    from: { x: 0.566, y: 0.631 },
    to: { x: 0.600, y: 0.520 },
    label: { x: -0.020, y: -0.140 },
    enter: 0.12,
  },
  {
    id: 'gateway',
    name: 'Gateway Business Hub',
    from: { x: 0.434, y: 0.701 },
    to: { x: 0.399, y: 0.613 },
    label: { x: -0.150, y: -0.055 },
    enter: 0.15,
  },
  {
    id: 'urban',
    name: 'Urban GL',
    from: { x: 0.539, y: 0.771 },
    to: { x: 0.527, y: 0.769 },
    label: { x: 0.075, y: 0.115 },
    enter: 0.18,
  },
  {
    id: 'nexus',
    name: 'S&S Nexus',
    from: { x: 0.684, y: 0.748 },
    to: { x: 0.703, y: 0.697 },
    label: { x: 0.115, y: -0.130 },
    enter: 0.21,
  },
];

/**
 * The descent leaves the aerial and drops to street level, where the assets are
 * no longer laid out to be named. Callouts live in the overhead stretch and
 * clear before the plunge, so `to` is each anchor's position at the end of this
 * window rather than at the last frame.
 */
export const CALLOUT_WINDOW = 0.36;

/** Anchor position on the frame at a given scrub progress. */
export function anchorAt(b: Building, p: number) {
  const t = Math.min(1, p / CALLOUT_WINDOW);
  return {
    x: b.from.x + (b.to.x - b.from.x) * t,
    y: b.from.y + (b.to.y - b.from.y) * t,
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
