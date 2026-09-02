'use client';

import { useState } from 'react';
import Link from 'next/link';
import FeaturedPostCard from './FeaturedPostCard';
import JournalGridItem from './JournalGridItem';
import { CATEGORIES, POSTS } from '@/lib/news';

/**
 * Holds the category filter state, since it needs to reach both the header
 * (the filter links) and the grid (what it shows) — the featured block above
 * stays constant regardless of filter, as the page's fixed highlight.
 */
export default function JournalPage() {
  const [category, setCategory] = useState<string | null>(null);

  const featured = POSTS.filter((p) => p.featured).slice(0, 2);
  const grid = category ? POSTS.filter((p) => p.category === category) : POSTS;

  return (
    <>
      <header className="journal-header">
        <Link className="journal-header__back" href="/">
          Back to the masterplan
        </Link>
        <h1 className="journal-header__title">News</h1>
        <div className="journal-header__rule" />
        <div className="journal-header__row">
          <nav className="journal-filters" aria-label="Filter by category">
            <button
              type="button"
              className={`journal-filters__item${category === null ? ' is-active' : ''}`}
              onClick={() => setCategory(null)}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`journal-filters__item${category === c ? ' is-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </nav>
          <span className="journal-badge">
            <span className="journal-badge__dot" aria-hidden="true" />
            Discover
          </span>
        </div>
      </header>

      {featured.length === 2 && (
        <section className="featured-posts">
          <FeaturedPostCard post={featured[0]} align="left" />
          <FeaturedPostCard post={featured[1]} align="right" />
        </section>
      )}

      <section className="journal-grid-section">
        <h2 className="journal-grid-section__title">All journal posts</h2>
        <div className="journal-grid">
          {grid.map((post, i) => (
            <JournalGridItem key={post.id} post={post} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>
    </>
  );
}
