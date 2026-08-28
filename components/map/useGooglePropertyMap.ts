'use client';

import { useEffect, useRef, useState } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import type { Property, Region } from '@/lib/map/types';
import { plottable } from '@/lib/map/validate';

type Args = {
  region: Region;
  onSelect: (p: Property | null) => void;
  activeId: string | null;
};

/**
 * Owns the Google map and its markers.
 *
 * Colour and labelling come from a cloud style attached to the Map ID rather
 * than a CSS filter over the tiles: a filter would drag the markers and cards
 * with it, and cannot tell a road from the sea. Only the pins and cards are
 * ours to style here.
 *
 * One map is kept across regions and its markers replaced, rather than a map
 * per region — building a map is the expensive part, and a switch should read
 * as the camera travelling.
 */
export function useGooglePropertyMap({ region, onSelect, activeId }: Args) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markerLib = useRef<google.maps.MarkerLibrary | null>(null);
  const markers = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const [status, setStatus] = useState<'idle' | 'ready' | 'error'>('idle');

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

  useEffect(() => {
    if (!key || !container.current || map.current) return;
    let cancelled = false;

    setOptions({ key, v: 'weekly' });

    Promise.all([importLibrary('maps'), importLibrary('marker')])
      .then(([maps, marker]) => {
        if (cancelled || !container.current) return;

        markerLib.current = marker;
        map.current = new maps.Map(container.current, {
          center: { lng: region.center[0], lat: region.center[1] },
          zoom: region.zoom,
          // Advanced Markers and cloud styling both require a Map ID.
          mapId,
          disableDefaultUI: true,
          zoomControl: true,
          // The page scrolls sideways through this panel, so the wheel alone
          // must not zoom: cooperative asks for a modifier and keeps drag and
          // touch as they are.
          gestureHandling: 'cooperative',
          clickableIcons: false,
        });
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      markers.current.forEach((m) => (m.map = null));
      markers.current.clear();
      map.current = null;
    };
    // The opening view is read once; later region changes pan the camera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, mapId]);

  // Markers follow the region. Detaching before rebuilding means a switch
  // cannot leave the previous region's pins behind.
  useEffect(() => {
    const instance = map.current;
    const lib = markerLib.current;
    if (!instance || !lib || status !== 'ready') return;

    markers.current.forEach((m) => (m.map = null));
    markers.current.clear();

    for (const p of plottable(region.properties)) {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'pin';
      el.setAttribute('aria-label', `Open details for ${p.name}`);
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelect(p);
      });

      const marker = new lib.AdvancedMarkerElement({
        map: instance,
        position: { lng: p.longitude, lat: p.latitude },
        content: el,
        title: p.name,
      });

      markers.current.set(p.id, marker);
    }

    instance.panTo({ lng: region.center[0], lat: region.center[1] });
    instance.setZoom(region.zoom);
  }, [region, onSelect, status]);

  // The active state lives on the marker's own element: the markers are the
  // map's children rather than React's.
  useEffect(() => {
    markers.current.forEach((marker, id) => {
      (marker.content as HTMLElement | null)?.classList.toggle('pin--active', id === activeId);
    });
  }, [activeId]);

  return { container, status, token: key };
}
