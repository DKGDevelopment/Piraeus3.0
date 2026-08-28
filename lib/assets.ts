import {
  SKYBLUE_RESIDENCES,
  SKYWAY_RESIDENCES,
  URBAN_RESIDENCES,
  NEXUS_RESIDENCES,
  GREATER_RESIDENCES,
  REALIDEAL_RESIDENCES,
  type Residence,
} from './residences';

/**
 * Everything an asset page renders, per asset.
 *
 * The page is one layout driven by this: adding an asset is an entry here plus
 * its media, not another page. An asset without a residence or a map simply
 * omits those panels rather than showing empty ones.
 */
export type AssetPage = {
  /** Category line under the title. Omitted until the asset's use is settled. */
  standfirst?: string;
  /**
   * Base name in /public/video: <film>.mp4, -sm.mp4, .webm, -sm.webm,
   * -poster.webp. Without one the page opens on a title card instead, so an
   * asset can have a page before it has a film.
   */
  film?: string;
  project?: {
    lead: string[];
    body: string[];
  };
  residence?: Residence;
  location?: {
    heading: string;
    copy: string;
    /** Path under /public. Absent until the artwork exists. */
    map?: string;
    places: { name: string; note: string }[];
  };
};

/** True of every asset, so it carries to a page before its own copy is written. */
const ETHOS = [
  'At Piraeus Gate, we believe that a home is more than a physical space — it’s a reflection of your aspirations, well-being, and values.',
  'Our mission is to immerse you in a lifestyle that balances refined aesthetics, architectural excellence, and a profound sense of community.',
];

/** Shared until each asset's own neighbourhood copy is written. */
const NEIGHBOURHOOD = {
  heading: 'The Neighbourhood',
  copy: 'Set between the port and the coast road, within walking distance of the metro and the waterfront.',
  places: [
    { name: 'Piraeus port', note: '5 min' },
    { name: 'Metro, Line 3', note: '7 min on foot' },
    { name: 'Coast road', note: '3 min on foot' },
    { name: 'Athens centre', note: '20 min' },
    { name: 'Airport', note: '45 min' },
  ],
};

export const ASSET_PAGES: Record<string, AssetPage> = {
  skyblue: {
    standfirst: 'Serviced Apartments',
    film: 'skyblue',
    project: {
      lead: [
        'The architecture of SkyBlue balances clean contemporary lines with Mediterranean warmth and texture.',
        'Whether you’re seeking a serene retreat, cultural hub, or a space that fosters personal growth, SkyBlue offers it all.',
      ],
      body: [
        'At Piraeus Gate, we believe that a home is more than a physical space — it’s a reflection of your aspirations, well-being, and values.',
        'Our mission is to immerse you in a lifestyle that balances refined aesthetics, architectural excellence, and a profound sense of community.',
      ],
    },
    residence: SKYBLUE_RESIDENCES[0],
    location: { ...NEIGHBOURHOOD, map: '/location/skyblue-map.webp' },
  },

  // Copy, interiors and map are still to come; the film is in place.
  skyway: {
    standfirst: 'Residences',
    film: 'skyway',
    project: {
      lead: [
        'Explore our collection of residences, each designed to offer effortless living in liberating spaces.',
        'Our curated homes blend luxury with convenience, ensuring a seamless living experience.',
      ],
      body: [
        'Discover a place where every detail is crafted to meet the highest standards of comfort and elegance. Find your perfect sanctuary at Piraeus Gate today.',
        'At Piraeus Gate, we believe that a home is more than a physical space — it’s a reflection of your aspirations, well-being, and values.',
        'Our mission is to immerse you in a lifestyle that balances refined aesthetics, architectural excellence, and a profound sense of community.',
      ],
    },
    residence: SKYWAY_RESIDENCES[0],
    location: NEIGHBOURHOOD,
  },

  // Awaiting film, copy, interiors and areas. Each opens on a title card and
  // carries the location and the coda; panels appear as their content arrives.
  greater: {
    standfirst: 'Residential',
    film: 'greater',
    project: { lead: [], body: ETHOS },
    residence: GREATER_RESIDENCES[0],
    location: NEIGHBOURHOOD,
  },

  gateway: {
    standfirst: 'Offices',
    film: 'gateway',
    project: { lead: [], body: ETHOS },
    location: NEIGHBOURHOOD,
  },

  urban: {
    standfirst: 'Residences',
    film: 'urban',
    project: { lead: [], body: ETHOS },
    residence: URBAN_RESIDENCES[0],
    location: NEIGHBOURHOOD,
  },

  realideal: {
    standfirst: 'Residential',
    film: 'realideal',
    project: { lead: [], body: ETHOS },
    residence: REALIDEAL_RESIDENCES[0],
    location: NEIGHBOURHOOD,
  },

  nexus: {
    standfirst: 'Mixed-Use',
    film: 'nexus',
    project: { lead: [], body: ETHOS },
    residence: NEXUS_RESIDENCES[0],
    location: NEIGHBOURHOOD,
  },
};
