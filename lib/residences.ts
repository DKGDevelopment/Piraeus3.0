/**
 * Residence types shown on an asset's Residences panel.
 *
 * `rooms` drives both the gallery and the figure beneath it, so a room without
 * an image still contributes its area — the copy and the numbers do not wait on
 * photography.
 */
export type Room = {
  id: string;
  /** Names the view, e.g. "Bedroom". */
  label: string;
  /** Path under /public. Absent until the render exists. */
  image?: string;
};

export type Residence = {
  id: string;
  /** The residence's own name, e.g. "Lumière Duplex Residences". */
  name: string;
  description: string;
  /** Numeric so it can be formatted rather than parsed back out. */
  area: number;
  /** Set when the residence spans a range of sizes rather than one. */
  areaMax?: number;
  unit: string;
  rooms: Room[];
};

/**
 * Room labels are read from the renders themselves; the description is still
 * placeholder. The area is the supplied figure for the whole residence.
 */
export const SKYBLUE_RESIDENCES: Residence[] = [
  {
    id: 'skyblue',
    name: 'Skyblue Residences',
    description:
      'Residences arranged around a generous living space, with private terraces and a mix of layouts across the two towers.',
    area: 147,
    unit: 'm²',
    rooms: [
      { id: 'bedroom', label: 'Bedroom', image: '/residences/skyblue-1.webp' },
      { id: 'living', label: 'Living', image: '/residences/skyblue-2.webp' },
      { id: 'lounge', label: 'Lounge', image: '/residences/skyblue-3.webp' },
      { id: 'study', label: 'Study', image: '/residences/skyblue-4.webp' },
      { id: 'dining', label: 'Dining', image: '/residences/skyblue-5.webp' },
    ],
  },
];

/** Skyway: three interiors supplied; layouts span a range of sizes. */
export const SKYWAY_RESIDENCES: Residence[] = [
  {
    id: 'skyway',
    name: 'Skyway Residences',
    description:
      'Residences on stacked terraces, each floor stepping back to hold a garden and a view toward the port.',
    area: 56,
    areaMax: 83,
    unit: 'm²',
    rooms: [
      { id: 'living', label: 'Living', image: '/residences/skyway-1.webp' },
      { id: 'bedroom', label: 'Bedroom', image: '/residences/skyway-2.webp' },
      { id: 'kitchen', label: 'Kitchen', image: '/residences/skyway-3.webp' },
    ],
  },
];
