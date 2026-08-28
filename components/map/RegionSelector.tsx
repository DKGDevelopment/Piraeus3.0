'use client';

import type { Region } from '@/lib/map/types';
import { plottable } from '@/lib/map/validate';

/**
 * Real buttons, so the selector is reachable and operable from the keyboard
 * without any added handling.
 */
export default function RegionSelector({
  regions,
  activeId,
  onSelect,
}: {
  regions: Region[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  if (regions.length < 2) return null;

  return (
    <div className="regions" role="tablist" aria-label="Regions">
      {regions.map((r) => (
        <button
          key={r.id}
          type="button"
          role="tab"
          aria-selected={r.id === activeId}
          className={`regions__btn${r.id === activeId ? ' is-active' : ''}`}
          onClick={() => onSelect(r.id)}
        >
          {r.name}
          <span className="regions__count">{plottable(r.properties).length}</span>
        </button>
      ))}
    </div>
  );
}
