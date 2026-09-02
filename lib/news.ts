export type Outlet = {
  id: string;
  name: string;
  /** Path under /public/partners-news. Absent until the user uploads it. */
  logo?: string;
};

export type Post = {
  id: string;
  title: string;
  category: string;
  /** ~16:10 or wider; object-fit: cover handles both the hero and grid use. */
  coverImage: string;
  href: string;
  /** Exactly two posts should carry this at a time — the featured block
   * always wants a left card and a right card. */
  featured: boolean;
};

/**
 * Outlets that have featured the masterplan. Logos arrive later — a row with
 * no logos renders nothing rather than an empty marquee band, so this can
 * ship ahead of the assets.
 */
export const OUTLETS: Outlet[] = [];

export const CATEGORIES = ['Project Stories', 'Press Coverage'] as const;

/**
 * PLACEHOLDER CONTENT. Stand-in entries so the page's design can be reviewed
 * before the real articles (title, category, image, link) arrive — swap
 * this array once they do, keeping exactly two `featured: true`.
 */
export const POSTS: Post[] = [
  {
    id: 'placeholder-1',
    title: 'A first look at the waterfront masterplan reshaping Piraeus',
    category: 'Project Stories',
    coverImage: '/plate/masterplan-menu.webp',
    href: '#',
    featured: true,
  },
  {
    id: 'placeholder-2',
    title: 'DKG Development breaks ground on Greece’s largest mixed-use development',
    category: 'Press Coverage',
    coverImage: '/plate/team-menu.webp',
    href: '#',
    featured: true,
  },
  {
    id: 'placeholder-3',
    title: 'Piraeus Gate brings 631 private residences to the city’s new gateway',
    category: 'Project Stories',
    coverImage: '/plate/news-menu.webp',
    href: '#',
    featured: false,
  },
  {
    id: 'placeholder-4',
    title: 'Inside the integrated development model behind Greece’s most active portfolio',
    category: 'Press Coverage',
    coverImage: '/video/skyblue-poster.webp',
    href: '#',
    featured: false,
  },
];
