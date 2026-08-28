import type { Property } from './types';

/**
 * A coordinate is usable only if both parts are finite and in range. Mapbox
 * takes [longitude, latitude]; a reversed pair is silently plottable near the
 * equator, so both bounds are checked rather than assuming order.
 */
export function hasValidCoordinates(p: Property): boolean {
  const { longitude, latitude } = p;
  return (
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
}

/**
 * Drops properties that cannot be plotted rather than letting one bad record
 * break the map, and says which in development so it can be fixed at source.
 */
export function plottable(properties: Property[]): Property[] {
  const good: Property[] = [];
  for (const p of properties) {
    if (hasValidCoordinates(p)) good.push(p);
    else if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[map] "${p.name}" (${p.id}) omitted: coordinates ${p.longitude}, ${p.latitude} are not usable.`
      );
    }
  }
  return good;
}
