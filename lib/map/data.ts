import { BUILDINGS } from '@/lib/buildings';
import type { Property, Region } from './types';

/**
 * Local data adapter.
 *
 * Replace `getRegions` with a call to the real API — `GET /api/properties?region=…`
 * or a CMS query — without touching the map: the map consumes Regions, not this
 * file.
 */
const SITE: [number, number] = [23.6465, 37.9455];

const ADDRESSES: Record<string, { address: string; latitude: number; longitude: number }> = {
  nexus: { address: 'Ipsilantou 1, Piraeus', latitude: 37.947603032101306, longitude: 23.65442506280646 },
  skyway: { address: 'Grigoriou Lambraki 18, Piraeus', latitude: 37.946922143783766, longitude: 23.654656053369948 },
  urban: { address: 'Grigoriou Lambraki 12, Piraeus', latitude: 37.94744619793369, longitude: 23.655202326381428 },
  gateway: { address: 'Grigoriou Lambraki 14-16, Piraeus', latitude: 37.94738598214228, longitude: 23.655200226381577 },
  realideal: { address: 'Ipsilantou 3, Piraeus', latitude: 37.94722128252143, longitude: 23.6541011956992 },
  greater: { address: 'Skilitsi & Kountouriotou 4, Piraeus', latitude: 37.94778320217671, longitude: 23.65391539754619 },
  skyblue: { address: 'Grigoriou Lambraki 18, Piraeus', latitude: 37.94689676211899, longitude: 23.654731155216798 },
};

const properties: Property[] = BUILDINGS.map((b) => {
  const loc = ADDRESSES[b.id];
  return {
    id: b.id,
    name: b.name,
    region: 'piraeus',
    address: loc?.address ?? 'Piraeus Gate, Piraeus',
    longitude: loc?.longitude ?? SITE[0],
    latitude: loc?.latitude ?? SITE[1],
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
