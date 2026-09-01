import PartnersMarquee from '@/components/PartnersMarquee';
import TeamBody from '@/components/TeamBody';
import TeamFilm from '@/components/TeamFilm';

export const metadata = { title: 'The Team — Piraeus Gate' };

export default function Page() {
  return (
    <main className="team">
      <TeamFilm />
      <TeamBody />
      <PartnersMarquee />
    </main>
  );
}
