import Link from 'next/link';

export const metadata = { title: 'The Team — Piraeus Gate' };

const BODY = [
  `DKG Development is one of Greece's most active real estate development companies, with a growing portfolio of large-scale residential, commercial, and hospitality projects across the country. Headquartered in Greece and operating across multiple asset classes, DKG offers a fully integrated development model — from initial concept and planning through to construction, delivery, and long-term asset management — serving both domestic clients and international investors seeking exposure to the Greek property market.`,
  `The company's flagship project, Piraeus Gate, stands as one of the largest mixed-use developments currently under construction in Greece, spanning 105,000 sqm of gross built area and comprising 631 private residences, 268 serviced apartments, and an extensive programme of office, retail, and hospitality spaces.`,
  `Across every project, DKG Development applies a consistent set of principles: energy-efficient construction, high-specification materials, cutting-edge building technologies, and a genuine focus on enhancing the urban environments in which it operates.`,
];

export default function Page() {
  return (
    <main className="team">
      <div className="team-film">
        <video
          className="team-film__video"
          poster="/video/team-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/video/team-sm.webm" media="(max-width: 900px)" type="video/webm" />
          <source src="/video/team-sm.mp4" media="(max-width: 900px)" type="video/mp4" />
          <source src="/video/team.webm" type="video/webm" />
          <source src="/video/team.mp4" type="video/mp4" />
        </video>
        <Link className="team-film__back" href="/">
          Back to the masterplan
        </Link>
      </div>

      <div className="team-body">
        {BODY.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="team-body__p">
            {paragraph}
          </p>
        ))}
      </div>
    </main>
  );
}
