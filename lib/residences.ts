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
      'These suites are designed as serene garden sanctuaries, where soft daylight, flowing layouts, and rich natural textures create an atmosphere of quiet retreat. With private landscaped terraces, generous living areas, and exclusive wellness-oriented amenities.',
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

/** Urban GL: four interiors supplied; compact layouts spanning a range. */
export const URBAN_RESIDENCES: Residence[] = [
  {
    id: 'urban',
    name: 'Urban GL Residences',
    description:
      'Compact residences arranged around a single generous room, with a joinery screen dividing sleeping from living and a full kitchen along one wall.',
    area: 20,
    areaMax: 35,
    unit: 'm²',
    rooms: [
      { id: 'study', label: 'Study', image: '/residences/urban-1.webp' },
      { id: 'dining', label: 'Dining', image: '/residences/urban-2.webp' },
      { id: 'living', label: 'Living', image: '/residences/urban-3.webp' },
      { id: 'bedroom', label: 'Bedroom', image: '/residences/urban-4.webp' },
    ],
  },
];

/**
 * S&S Nexus: three interiors supplied. No area given yet, so the figure reads
 * as unknown rather than as a number.
 */
export const NEXUS_RESIDENCES: Residence[] = [
  {
    id: 'nexus',
    name: 'S&S Nexus Residences',
    description:
      'Studios opening onto a shared corridor, each with its own workspace and a terrace beyond the glazing.',
    area: 0,
    unit: 'm²',
    rooms: [
      { id: 'bedroom', label: 'Bedroom', image: '/residences/nexus-1.webp' },
      { id: 'workspace', label: 'Workspace', image: '/residences/nexus-2.webp' },
      { id: 'corridor', label: 'Corridor', image: '/residences/nexus-3.webp' },
    ],
  },
];
