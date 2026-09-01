export type Outlet = {
  id: string;
  name: string;
  /** Path under /public/partners-news. Absent until the user uploads it. */
  logo?: string;
};

export type Article = {
  id: string;
  outlet: string;
  description: string;
  image: string;
  href: string;
};

/**
 * Outlets that have featured the masterplan. Logos arrive later — a row with
 * no logos renders nothing rather than an empty marquee band, so this can
 * ship ahead of the assets.
 */
export const OUTLETS: Outlet[] = [];

/**
 * PLACEHOLDER CONTENT. Stand-in entries so the page's design can be reviewed
 * before the real 21 articles (image, description, outlet, link) arrive —
 * swap this array once they do.
 */
export const ARTICLES: Article[] = [
  {
    id: 'placeholder-1',
    outlet: 'Kathimerini',
    description: 'A first look at the waterfront masterplan reshaping the port district of Piraeus.',
    image: '/plate/masterplan-menu.webp',
    href: '#',
  },
  {
    id: 'placeholder-2',
    outlet: 'Ekathimerini',
    description: 'DKG Development breaks ground on one of the largest mixed-use developments under construction in Greece.',
    image: '/plate/team-menu.webp',
    href: '#',
  },
  {
    id: 'placeholder-3',
    outlet: 'Ναυτεμπορική',
    description: 'Piraeus Gate brings 631 private residences and 268 serviced apartments to the city’s new gateway.',
    image: '/plate/news-menu.webp',
    href: '#',
  },
  {
    id: 'placeholder-4',
    outlet: 'Real Estate News',
    description: 'Inside the integrated development model behind Greece’s most active real estate portfolio.',
    image: '/video/skyblue-poster.webp',
    href: '#',
  },
];
