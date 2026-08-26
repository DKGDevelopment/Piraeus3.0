import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

// Self-hosted at build time, so the callouts get a real heavy weight rather
// than whatever the platform substitutes for a bold system font.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Piraeus Masterplan',
  description: 'An urban redevelopment masterplan for the Piraeus waterfront.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
