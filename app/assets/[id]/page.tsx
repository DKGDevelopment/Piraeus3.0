import Link from 'next/link';
import { notFound } from 'next/navigation';
import AssetShell from '@/components/AssetShell';
import AssetVideo from '@/components/AssetVideo';
import Residences from '@/components/Residences';
import LocationPanel from '@/components/LocationPanel';
import Newsletter from '@/components/Newsletter';
import { BUILDINGS } from '@/lib/buildings';
import { ASSET_PAGES } from '@/lib/assets';

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

  const page = ASSET_PAGES[id];

  // Assets whose film has not been shot yet keep a holding page.
  if (!page) {
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
      <AssetShell filledFromStart={!page.film}>
        {page.film ? (
          <section className="panel panel--film">
            <AssetVideo
              name={building.name}
              standfirst={page.standfirst}
              src={page.film}
            />
          </section>
        ) : (
          // Until the film exists the page still opens on the asset, named.
          <section className="panel panel--title">
            <div className="titlecard">
              <h1 className="asset-hero__title">{building.name}</h1>
              {page.standfirst && (
                <p className="asset-hero__standfirst">{page.standfirst}</p>
              )}
            </div>
          </section>
        )}

        {page.project && (
        <section className="panel panel--text">
          <div className="panel__spread">
            <div className="panel__col">
              <p className="panel__eyebrow">The Project</p>
              {page.project.lead.map((line) => (
                <p className="panel__lead" key={line}>
                  {line}
                </p>
              ))}
            </div>

            <div className="panel__col panel__col--end">
              {page.project.body.map((line) => (
                <p className="panel__body" key={line}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </section>
        )}

        {page.residence && (
          <section className="panel panel--res">
            <Residences residence={page.residence} />
          </section>
        )}

        {page.location && (
          <section className="panel panel--res">
            <LocationPanel
              heading={page.location.heading}
              copy={page.location.copy}
              map={page.location.map}
              places={page.location.places}
            />
          </section>
        )}

        <section className="panel panel--sub">
          <Newsletter />
        </section>
      </AssetShell>
    </main>
  );
}
