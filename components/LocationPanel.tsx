'use client';

import dynamic from 'next/dynamic';
import { getRegions } from '@/lib/map/data';

// Mapbox touches window on construction, so it must not run during the server
// render. Loading it on the client also keeps its weight off first paint.
const PropertyMap = dynamic(() => import('./map/PropertyMap'), { ssr: false });

type Place = { name: string; note: string };

type Props = {
  heading: string;
  copy: string;
  /** Path under /public. Absent until the map artwork is supplied. */
  map?: string;
  places: Place[];
};

/**
 * Where the asset sits. The map holds the panel; the column beside it names
 * what is within reach.
 *
 * The map is live where a Mapbox token is configured, and falls back to the
 * still artwork otherwise, so the panel is never an empty rectangle.
 */
export default function LocationPanel({ heading, copy, map, places }: Props) {
  return (
    <div className="loc">
      <div className="loc__map">
        {process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? (
          <PropertyMap regions={getRegions()} />
        ) : map ? (
          <img className="loc__img" src={map} alt="Map of the surrounding area" />
        ) : (
          <div className="loc__img loc__img--empty">
            <span>Map</span>
          </div>
        )}
      </div>

      <aside className="loc__panel">
        <p className="panel__eyebrow">Location</p>
        <h2 className="res__name">{heading}</h2>
        <p className="res__copy">{copy}</p>

        <dl className="loc__list">
          {places.map((p) => (
            <div className="loc__row" key={p.name}>
              <dt className="loc__place">{p.name}</dt>
              <dd className="loc__note">{p.note}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
