import Link from 'next/link';

export const metadata = { title: 'Masterplan — Piraeus Gate' };

export default function Page() {
  return (
    <main className="asset">
      <Link className="asset__back" href="/">
        Back to the masterplan
      </Link>
      <h1 className="asset__title">Masterplan</h1>
      <p className="asset__note">
        An index of the seven assets. In preparation.
      </p>
    </main>
  );
}
