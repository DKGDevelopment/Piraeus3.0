const LOGOS = [
  'aephora',
  'alexopoulos',
  'arapis',
  'carlo-pasqualin',
  'dae',
  'danos',
  'emphasis',
  'esgenius',
  'geoperivallon',
  'grozopoulos',
  'ib',
  'ihg',
  'karanasios',
  'kns',
  'kronos',
  'ksn',
  'lavish',
  'marlon-tate',
  'meletitiki',
  'msm',
  'resnovae',
  'roussos',
  'savils',
  'sergiadou',
  'smartrental',
  'technoiko',
  'tesseract',
  'tsolakis-partners',
  'vpc',
  'vplaw',
  'xorometris',
];

const TOP_ROW = LOGOS.filter((_, i) => i % 2 === 0);
const BOTTOM_ROW = LOGOS.filter((_, i) => i % 2 === 1);

function Row({ logos, direction }: { logos: string[]; direction: 'left' | 'right' }) {
  // Duplicated so the track can loop seamlessly at -50%.
  const track = [...logos, ...logos];
  return (
    <div className={`marquee__row marquee__row--${direction}`}>
      <div className="marquee__track">
        {track.map((id, i) => (
          <img
            key={`${id}-${i}`}
            className="marquee__logo"
            src={`/partners/${id}.png`}
            alt={id.replace(/-/g, ' ')}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

export default function PartnersMarquee() {
  return (
    <div className="marquee">
      <p className="marquee__label">Partners</p>
      <Row logos={TOP_ROW} direction="right" />
      <Row logos={BOTTOM_ROW} direction="left" />
    </div>
  );
}
