import { OUTLETS } from '@/lib/news';

/**
 * Same two-row, opposite-direction marquee as the team page's partner
 * logos — the pattern already established for "too many logos to fit".
 * Renders nothing until outlet logos are uploaded.
 */
export default function NewsOutletsMarquee() {
  const withLogos = OUTLETS.filter((o) => o.logo);
  if (withLogos.length === 0) return null;

  const top = withLogos.filter((_, i) => i % 2 === 0);
  const bottom = withLogos.filter((_, i) => i % 2 === 1);

  return (
    <div className="marquee">
      <p className="marquee__label">As Featured In</p>
      <Row outlets={top} direction="right" />
      <Row outlets={bottom} direction="left" />
    </div>
  );
}

function Row({ outlets, direction }: { outlets: Outlet[]; direction: 'left' | 'right' }) {
  const track = [...outlets, ...outlets];
  return (
    <div className={`marquee__row marquee__row--${direction}`}>
      <div className="marquee__track">
        {track.map((o, i) => (
          <img key={`${o.id}-${i}`} className="marquee__logo" src={o.logo} alt={o.name} loading="lazy" />
        ))}
      </div>
    </div>
  );
}

type Outlet = { id: string; name: string; logo?: string };
