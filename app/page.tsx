import Hero from '@/components/Hero';
import StreetChapter from '@/components/StreetChapter';
import LaneChapter from '@/components/LaneChapter';

export default function Page() {
  return (
    <main>
      <Hero />
      <StreetChapter />
      <LaneChapter />
      <section className="placeholder">
        <p>Next chapter</p>
      </section>
    </main>
  );
}
