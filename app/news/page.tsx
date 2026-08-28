import Link from 'next/link';

export const metadata = { title: 'News — Piraeus Gate' };

export default function Page() {
  return (
    <main className="asset">
      <Link className="asset__back" href="/">
        Back to the masterplan
      </Link>
      <h1 className="asset__title">News</h1>
      <p className="asset__note">Announcements and progress from the development. In preparation.</p>
    </main>
  );
}
