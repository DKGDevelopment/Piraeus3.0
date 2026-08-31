import Link from 'next/link';

export const metadata = { title: 'The Team — Piraeus Gate' };

export default function Page() {
  return (
    <main className="asset">
      <Link className="asset__back" href="/">
        Back to the masterplan
      </Link>
      <h1 className="asset__title">The Team</h1>
      <p className="asset__note">People behind Piraeus Gate. In preparation.</p>
    </main>
  );
}
