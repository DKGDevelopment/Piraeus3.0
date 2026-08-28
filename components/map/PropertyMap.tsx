'use client';

import { useCallback, useMemo, useState } from 'react';
// Swap this import (and the call below) for useMapboxPropertyMap to return
// to Mapbox; both hooks present the same surface.
import { useGooglePropertyMap } from './useGooglePropertyMap';
import PropertyCard from './PropertyCard';
import RegionSelector from './RegionSelector';
import type { Property, Region } from '@/lib/map/types';
import { plottable } from '@/lib/map/validate';

/**
 * The property map: a region selector, one interactive map, and a card for the
 * selected property.
 *
 * Every failure has its own visible state — no token, no properties, a map that
 * would not start — because a blank rectangle tells a visitor nothing and tells
 * us nothing either.
 */
export default function PropertyMap({ regions }: { regions: Region[] }) {
  const [regionId, setRegionId] = useState(regions[0]?.id ?? '');
  const [active, setActive] = useState<Property | null>(null);

  const region = useMemo(
    () => regions.find((r) => r.id === regionId) ?? regions[0],
    [regions, regionId]
  );

  const handleSelect = useCallback((p: Property | null) => setActive(p), []);

  const changeRegion = useCallback((id: string) => {
    // A card from the previous region would outlive its marker.
    setActive(null);
    setRegionId(id);
  }, []);

  const { container, status, token } = useGooglePropertyMap({
    region,
    onSelect: handleSelect,
    activeId: active?.id ?? null,
  });

  if (!region) return <div className="map map--empty">No regions configured.</div>;

  const count = plottable(region.properties).length;

  return (
    <div className="map">
      <RegionSelector regions={regions} activeId={region.id} onSelect={changeRegion} />

      {!token ? (
        <div className="map__notice">
          <p>Map not configured.</p>
          <p className="map__hint">
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
            to enable it.
          </p>
        </div>
      ) : count === 0 ? (
        <div className="map__notice">
          <p>No properties in {region.name} yet.</p>
        </div>
      ) : (
        <>
          <div ref={container} className="map__canvas" />
          {status === 'error' && (
            <div className="map__notice map__notice--over">
              <p>The map could not be loaded.</p>
            </div>
          )}
          {active && <PropertyCard property={active} onClose={() => setActive(null)} />}
        </>
      )}
    </div>
  );
}
