import { BUILDINGS } from '@/lib/buildings';
import type { Property, Region } from './types';

/**
 * Local data adapter.
 *
 * Replace `getRegions` with a call to the real API — `GET /api/properties?region=…`
 * or a CMS query — without touching the map: the map consumes Regions, not this
 * file.
 *
 * PLACEHOLDER COORDINATES. These place each asset around the Piraeus Gate site
 * so the map can be built and reviewed; they are not surveyed positions and
 * must be replaced before the map is shown to anyone.
 */
const SITE: [number, number] = [23.6465, 37.9455];

const PLACEHOLDER_OFFSETS: Record<string, [number, number]> = {
  skyway: [-0.0016, 0.0009],
  skyblue: [-0.0008, 0.0004],
  greater: [0.0004, 0.0011],
  gateway: [-0.0002, -0.0002],
  urban: [0.0006, -0.0007],
  nexus: [0.0018, -0.0004],
};

const properties: Property[] = BUILDINGS.map((b) => {
  const [dx, dy] = PLACEHOLDER_OFFSETS[b.id] ?? [0, 0];
  return {
    id: b.id,
    name: b.name,
    region: 'piraeus',
    address: 'Piraeus Gate, Piraeus',
    longitude: SITE[0] + dx,
    latitude: SITE[1] + dy,
    href: `/assets/${b.id}`,
  };
});

const REGIONS: Region[] = [
  {
    id: 'piraeus',
    name: 'Piraeus',
    center: SITE,
    zoom: 15.2,
    properties,
  },
];

export function getRegions(): Region[] {
  return REGIONS;
}
