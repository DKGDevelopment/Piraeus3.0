/** A property that can be plotted and linked to. */
export type Property = {
  id: string;
  name: string;
  region: string;
  address?: string;
  longitude: number;
  latitude: number;
  imageUrl?: string;
  /** Where the marker's card links to. */
  href: string;
};

/** A city or district, its default view, and the properties within it. */
export type Region = {
  id: string;
  name: string;
  /** Mapbox ordering: longitude first. */
  center: [number, number];
  zoom: number;
  properties: Property[];
};
