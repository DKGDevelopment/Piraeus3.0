# Piraeus Masterplan — scroll-driven site

Next.js (App Router) + TypeScript, GSAP ScrollTrigger for scrub, Lenis for
inertial scrolling, and a canvas-scrubbed pre-rendered frame sequence for the
camera moves. Deploys to Vercel with no configuration.

## Run

    npm install
    npm run dev

## Frame sequences

Rendered camera-move videos are not committed — they are throwaway
intermediates. Build a sequence from one with:

    ./scripts/build-sequence.py path/to/render.mp4 hero --frames 130

This samples frames at equal intervals of cumulative motion (not equal time),
writes a full-width and a small tier into `public/sequence/`, and prints the
config to paste into `lib/sequence.ts`. Requires `ffmpeg` on PATH.

## Build order

1. **Hero descent** (current) — aerial over Piraeus scrubbed down to the
   development's facade.
2. District zoom + building hotspots.
3. Building detail chapters.
4. Masterplan data, plans, contact.
