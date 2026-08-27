import Link from 'next/link';
import { notFound } from 'next/navigation';
import AssetShell from '@/components/AssetShell';
import AssetVideo from '@/components/AssetVideo';
import Residences from '@/components/Residences';
import LocationPanel from '@/components/LocationPanel';
import { SKYBLUE_RESIDENCES } from '@/lib/residences';
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
            standfirst="Serviced Apartments"
            src="skyblue"
          />
        </section>

        <section className="panel panel--text">
          <div className="panel__inner panel__inner--wide">
            <p className="panel__eyebrow">The Project</p>
            <p className="panel__lead">
              The architecture of SkyBlue balances clean contemporary lines with
              Mediterranean warmth and texture.
            </p>
            <p className="panel__lead">
              Whether you&rsquo;re seeking a serene retreat, cultural hub, or a
              space that fosters personal growth, SkyBlue offers it all.
            </p>
            <p className="panel__body">
              At Piraeus Gate, we believe that a home is more than a physical
              space &mdash; it&rsquo;s a reflection of your aspirations,
              well-being, and values.
            </p>
            <p className="panel__body">
              Our mission is to immerse you in a lifestyle that balances refined
              aesthetics, architectural excellence, and a profound sense of
              community.
            </p>
          </div>
        </section>

        <section className="panel panel--res">
          <Residences residence={SKYBLUE_RESIDENCES[0]} />
        </section>

        <section className="panel panel--res">
          <LocationPanel
            places={[
              { name: 'Piraeus port', note: '5 min' },
              { name: 'Metro, Line 3', note: '7 min on foot' },
              { name: 'Coast road', note: '3 min on foot' },
              { name: 'Athens centre', note: '20 min' },
              { name: 'Airport', note: '45 min' },
            ]}
          />
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
