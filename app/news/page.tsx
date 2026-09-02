import JournalPage from '@/components/JournalPage';
import NewsOutletsMarquee from '@/components/NewsOutletsMarquee';

export const metadata = { title: 'News — Piraeus Gate' };

export default function Page() {
  return (
    <main className="journal">
      <JournalPage />
      <NewsOutletsMarquee />
    </main>
  );
}
