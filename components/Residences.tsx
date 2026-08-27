'use client';

import { useState } from 'react';
import type { Residence } from '@/lib/residences';

/**
 * A residence type: its gallery on one side, its description and the selected
 * room's area on the other.
 *
 * Rooms without a render still appear as selectable tiles carrying their name,
 * so the panel is complete before the photography is.
 */
export default function Residences({ residence }: { residence: Residence }) {
  const [active, setActive] = useState(0);
  const room = residence.rooms[active];

  return (
    <div className="res">
      <div className="res__stage">
        {room.image ? (
          <img className="res__shot" src={room.image} alt={room.label} />
        ) : (
          <div className="res__shot res__shot--empty">
            <span>{room.label}</span>
          </div>
        )}

        <p className="res__now">{room.label}</p>

        <div className="res__thumbs" role="tablist" aria-label="Rooms">
          {residence.rooms.map((r, i) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`res__thumb${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {r.image ? (
                <img src={r.image} alt="" />
              ) : (
                <span className="res__thumb-label">{r.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <aside className="res__panel">
        <p className="panel__eyebrow">Residences</p>
        <h2 className="res__name">{residence.name}</h2>
        <p className="res__copy">{residence.description}</p>

        <a className="res__cta" href="/contact">
          Book a visit
        </a>

        {/* One figure for the residence, not per room: the area given is the
            whole apartment, and inventing a breakdown would be fiction. */}
        <div className="res__figure">
          <p className="res__room">Total area</p>
          <p className="res__area">
            <span className="res__number">{residence.area.toLocaleString('en-US')}</span>
            <span className="res__unit">{residence.unit}</span>
          </p>
          <p className="res__caption">total interior area</p>
        </div>
      </aside>
    </div>
  );
}
