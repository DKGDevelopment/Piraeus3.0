'use client';

import Link from 'next/link';
import type { Property } from '@/lib/map/types';

export default function PropertyCard({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  return (
    <div className="mapcard" role="dialog" aria-label={`${property.name} details`}>
      <button
        type="button"
        className="mapcard__close"
        onClick={onClose}
        aria-label="Close details"
      >
        &times;
      </button>

      {property.imageUrl && (
        <img className="mapcard__img" src={property.imageUrl} alt="" />
      )}

      <p className="mapcard__name">{property.name}</p>
      {property.address && <p className="mapcard__address">{property.address}</p>}

      <Link className="mapcard__link" href={property.href}>
        View asset
      </Link>
    </div>
  );
}
