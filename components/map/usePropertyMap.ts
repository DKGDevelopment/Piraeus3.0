'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Property, Region } from '@/lib/map/types';
import { plottable } from '@/lib/map/validate';

type Args = {
  region: Region;
  onSelect: (p: Property | null) => void;
  activeId: string | null;
};

/**
 * Owns the Mapbox instance and its markers.
 *
 * One map is kept across regions and its markers replaced, rather than a map
 * per region: constructing a map is the expensive part, and a switch should
 * read as the camera travelling rather than the map being rebuilt.
 */
export function usePropertyMap({ region, onSelect, activeId }: Args) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [status, setStatus] = useState<'idle' | 'ready' | 'error'>('idle');

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // Build the map once. Regions are handled below by moving it, not remaking it.
  useEffect(() => {
    if (!token || !container.current || map.current) return;

    mapboxgl.accessToken = token;
    let instance: mapboxgl.Map;
    try {
      instance = new mapboxgl.Map({
        container: container.current,
        style:
          process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL ?? 'mapbox://styles/mapbox/standard',
        center: region.center,
        zoom: region.zoom,
        attributionControl: true,
      });
    } catch {
      setStatus('error');
      return;
    }

    // Wheel zoom off: the page scrolls sideways through this panel, and a map
    // that swallows the wheel would trap the reader in it.
    instance.scrollZoom.disable();
    instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    instance.on('load', () => setStatus('ready'));
    instance.on('error', () => setStatus('error'));
    map.current = instance;

    return () => {
      markers.current.forEach((m) => m.remove());
      markers.current.clear();
      instance.remove();
      map.current = null;
    };
    // Region is read once for the opening view; later changes fly the camera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Markers follow the region: old ones removed before new ones are added, so a
  // switch cannot leave a previous region's pins behind.
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;

    markers.current.forEach((m) => m.remove());
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

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([p.longitude, p.latitude])
        .addTo(instance);

      markers.current.set(p.id, marker);
    }

    instance.flyTo({ center: region.center, zoom: region.zoom, duration: 1200 });
  }, [region, onSelect]);

  // The active state lives on the DOM element rather than in a re-render, since
  // the markers are Mapbox's children rather than React's.
  useEffect(() => {
    markers.current.forEach((marker, id) => {
      marker.getElement().classList.toggle('pin--active', id === activeId);
    });
  }, [activeId]);

  return { container, status, token };
}
