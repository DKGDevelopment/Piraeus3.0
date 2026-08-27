/**
 * Residence types shown on an asset's Residences panel.
 *
 * `rooms` drives both the gallery and the figure beneath it, so a room without
 * an image still contributes its area — the copy and the numbers do not wait on
 * photography.
 */
export type Room = {
  id: string;
  /** Shown above the figure, e.g. "Bedroom". */
  label: string;
  /** Numeric so it can be formatted and totalled rather than parsed. */
  area: number;
  unit: string;
  /** Path under /public. Absent until the render exists. */
  image?: string;
  caption?: string;
};

export type Residence = {
  id: string;
  /** The residence's own name, e.g. "Lumière Duplex Residences". */
  name: string;
  description: string;
  rooms: Room[];
};

/** Placeholder until the real types, areas and renders are supplied. */
export const SKYBLUE_RESIDENCES: Residence[] = [
  {
    id: 'duplex',
    name: 'Duplex Residences',
    description:
      'Two-storey residences arranged around a double-height living space, with private terraces to the south and a mix of one, two and three bedroom layouts.',
    rooms: [
      { id: 'bedroom', label: 'Bedroom', area: 240, unit: 'sq. ft.' },
      { id: 'living', label: 'Living', area: 410, unit: 'sq. ft.' },
      { id: 'kitchen', label: 'Kitchen', area: 180, unit: 'sq. ft.' },
      { id: 'terrace', label: 'Terrace', area: 320, unit: 'sq. ft.' },
      { id: 'plan', label: 'Floor plan', area: 1150, unit: 'sq. ft.' },
    ],
  },
];
