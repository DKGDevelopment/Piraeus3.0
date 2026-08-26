# Piraeus Masterplan — scroll-driven site

Next.js (App Router) + TypeScript, GSAP ScrollTrigger for scrub, Lenis for
inertial scrolling, and a canvas-scrubbed pre-rendered frame sequence for the
camera moves. Deploys to Vercel with no configuration.

## Run

    npm install
    npm run dev

## Assets

Frame sequences live in `public/sequence/<id>/`. See
`public/sequence/hero/README.md` and `lib/sequence.ts`.

## Build order

1. **Hero descent** (current) — wide aerial scrubbed to a district-level view.
2. District zoom + building hotspots.
3. Building detail chapters.
4. Masterplan data, plans, contact.
