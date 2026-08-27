import Link from 'next/link';
import { notFound } from 'next/navigation';
import AssetShell from '@/components/AssetShell';
import AssetVideo from '@/components/AssetVideo';
import { BUILDINGS } from '@/lib/buildings';

export function generateStaticParams() {
  return BUILDINGS.map((b) => ({ id: b.id }));
}

export default async function AssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const building = BUILDINGS.find((b) => b.id === id);
  if (!building) notFound();

  // Skyblue is the worked example: the rest follow once their films exist.
  if (id !== 'skyblue') {
    return (
      <main className="asset">
        <Link className="asset__back" href="/">
          Back to the masterplan
        </Link>
        <h1 className="asset__title">{building.name}</h1>
        <p className="asset__note">This asset&rsquo;s page is in preparation.</p>
      </main>
    );
  }

  return (
    <main>
      <AssetShell>
        <section className="panel panel--film">
          <AssetVideo
            name={building.name}
            standfirst="Twin residential towers at the heart of the development."
            src="skyblue"
          />
        </section>

        <section className="panel panel--text">
          <div className="panel__inner">
            <p className="panel__eyebrow">The building</p>
            <p className="panel__lead">
              Two residential towers over an active ground floor, set back from
              the avenue behind a planted forecourt.
            </p>
          </div>
        </section>

        <section className="panel panel--text">
          <div className="panel__inner">
            <p className="panel__eyebrow">Residences</p>
            <p className="panel__lead">
              Apartment mix, floor plans and availability.
            </p>
            <p className="panel__note">In preparation.</p>
          </div>
        </section>

        <section className="panel panel--text">
          <div className="panel__inner">
            <p className="panel__eyebrow">Enquire</p>
            <p className="panel__lead">Register interest in Skyblue.</p>
            <p className="panel__note">In preparation.</p>
          </div>
        </section>
      </AssetShell>
    </main>
  );
}
