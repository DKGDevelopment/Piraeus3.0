import Link from 'next/link';
import NewsGrid from '@/components/NewsGrid';
import NewsOutletsMarquee from '@/components/NewsOutletsMarquee';

export const metadata = { title: 'News — Piraeus Gate' };

export default function Page() {
  return (
    <main className="news">
      <header className="news-hero">
        <Link className="news-hero__back" href="/">
          Back to the masterplan
        </Link>
        <h1 className="news-hero__title">News</h1>
        <p className="news-hero__standfirst">Coverage of Piraeus Gate across the Greek and international press.</p>
      </header>

      <NewsGrid />
      <NewsOutletsMarquee />
    </main>
  );
}
