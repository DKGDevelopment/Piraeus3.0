import Hero from '@/components/Hero';
import StreetChapter from '@/components/StreetChapter';

export default function Page() {
  return (
    <main>
      <Hero />
      <StreetChapter />
      <section className="placeholder">
        <p>Next chapter</p>
      </section>
    </main>
  );
}
