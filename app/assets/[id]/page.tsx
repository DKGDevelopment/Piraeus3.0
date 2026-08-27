import Link from 'next/link';
import { notFound } from 'next/navigation';
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

  // Skyblue is the worked example: the rest follow once their sequences exist.
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
      <AssetVideo
        name={building.name}
        standfirst="Twin residential towers at the heart of the development."
        src="skyblue"
      />
      <section className="asset-next">
        <p>Specifications, plans and availability</p>
      </section>
    </main>
  );
}
