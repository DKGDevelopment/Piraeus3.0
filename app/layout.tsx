import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display, Inter, JetBrains_Mono, Manrope } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

// Self-hosted at build time, so the callouts get a real heavy weight rather
// than whatever the platform substitutes for a bold system font.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

// Body copy on the asset pages: warmer and wider than Inter, which stays for
// titles and labels.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-dm',
});

// Tracked uppercase labels on the journal page: eyebrows, filters, the Read
// button — a monospace face reads as editorial/architectural rather than
// another weight of the display grotesk.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
});

// The Sky34 3D viewer's own "Coastal Concrete Editorial" type pairing —
// scoped to that page's CSS, not used anywhere else on the site.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-dm-serif',
});

export const metadata: Metadata = {
  title: 'Piraeus Masterplan',
  description: 'An urban redevelopment masterplan for the Piraeus waterfront.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${manrope.variable} ${dmSerifDisplay.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
