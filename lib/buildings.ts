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
    id: 'realideal',
    name: 'Real Ideal',
    from: { x: 0.313, y: 0.508 },
    to: { x: 0.256, y: 0.373 },
    label: { x: 0.055, y: -0.115 },
    enter: 0.15,
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

/**
 * Markers for the street-level arrival at the end of the descent.
 *
 * Only the assets that read as distinct masses from the road are marked: at
 * this altitude most of the site is behind the front block. No names here —
 * the visitor has already been told what these are on the way down, and leader
 * lines over a facade would clutter the arrival.
 *
 * The camera is still moving through this stretch, so these interpolate the
 * same way, between their positions at GROUND_START and the last frame.
 */
export const GROUND_START = 0.88;

export type GroundSpot = {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
};

export const GROUND_SPOTS: GroundSpot[] = [
  { id: 'urban', from: { x: 0.541, y: 0.577 }, to: { x: 0.405, y: 0.517 } },
  { id: 'gateway', from: { x: 0.338, y: 0.517 }, to: { x: 0.291, y: 0.457 } },
  { id: 'skyblue', from: { x: 0.176, y: 0.553 }, to: { x: 0.196, y: 0.517 } },
];

/** Ground marker position at a given scrub progress. */
export function groundAnchorAt(s: GroundSpot, p: number) {
  const t = Math.min(1, Math.max(0, (p - GROUND_START) / (1 - GROUND_START)));
  return {
    x: s.from.x + (s.to.x - s.from.x) * t,
    y: s.from.y + (s.to.y - s.from.y) * t,
  };
}

/**
 * Markers for a chapter that is not the aerial descent.
 *
 * Each carries its own window: in a walking shot a building enters and leaves
 * frame on its own schedule rather than all of them sharing one stretch, as
 * they do looking down at the site.
 */
export type ChapterSpot = {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  enter: number;
  exit: number;
};

export const LANE_SPOTS: ChapterSpot[] = [
  {
    id: 'nexus',
    from: { x: 0.203, y: 0.481 },
    to: { x: 0.120, y: 0.520 },
    enter: 0.30,
    exit: 0.62,
  },
  {
    id: 'gateway',
    from: { x: 0.527, y: 0.337 },
    to: { x: 0.439, y: 0.457 },
    enter: 0.45,
    exit: 1.0,
  },
];

/** Position and opacity of a chapter marker at a given scrub progress. */
export function spotAt(s: ChapterSpot, p: number) {
  const span = s.exit - s.enter;
  const t = Math.min(1, Math.max(0, (p - s.enter) / span));
  // Fades are a fixed slice of the window, so a short window does not snap.
  const edge = Math.min(0.06, span * 0.25);
  const opacity = Math.max(
    0,
    Math.min(1, (p - s.enter) / edge, (s.exit - p) / edge)
  );
  return {
    x: s.from.x + (s.to.x - s.from.x) * t,
    y: s.from.y + (s.to.y - s.from.y) * t,
    opacity,
  };
}

export const COURT_SPOTS: ChapterSpot[] = [
  // Anchors are read off the reference frame near the start of the chapter and
  // projected to the last frame through the sequence's own expansion, so each
  // stays on its building as the camera closes in. Two of them leave frame on
  // the way, and their windows end where they do.
  {
    id: 'nexus',
    from: { x: 0.468, y: 0.715 },
    to: { x: 0.418, y: 0.989 },
    enter: 0.08,
    exit: 0.45,
  },
  {
    id: 'urban',
    from: { x: 0.470, y: 0.454 },
    to: { x: 0.073, y: 0.827 },
    enter: 0.12,
    exit: 1.0,
  },
  {
    id: 'gateway',
    from: { x: 0.626, y: 0.400 },
    to: { x: 0.625, y: 0.495 },
    enter: 0.15,
    exit: 1.0,
  },
  {
    id: 'skyblue',
    from: { x: 0.808, y: 0.375 },
    to: { x: 1.009, y: 0.398 },
    enter: 0.10,
    exit: 0.45,
  },
];
