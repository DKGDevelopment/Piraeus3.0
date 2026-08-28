# Claude Code project notes

## Project

This repository is the Next.js/React/TypeScript implementation of the Piraeus Gate masterplan website. The homepage is a scroll-driven, cinematic masterplan experience. Asset detail pages live at `app/assets/[id]/page.tsx` and share the horizontal deck, fixed rail, and panel system implemented in `components/AssetShell.tsx`, `components/HorizontalDeck.tsx`, and related components.

## Skyway implementation

Skyway is now the second worked asset page after Skyblue. The route is:

```text
/assets/skyway
```

The Skyway branch is intentionally implemented in `app/assets/[id]/page.tsx` before the generic placeholder branch. Do not remove or move this branch unless the route architecture is being refactored deliberately.

The page currently contains:

1. A full-screen Skyway video hero using the shared `AssetVideo` component.
2. A project copy panel using the same two-column editorial layout as Skyblue.
3. The shared newsletter/footer panel.
4. The existing fixed rail and horizontal-deck behavior through `AssetShell`.

The Skyway page does **not** currently include a residence gallery, location map, apartment-area figures, or Skyway-specific enquiry backend. Those were not added because the `assets-v9` release supplied only a Skyway video. Do not invent project facts, dimensions, travel times, or interior imagery. Add those sections only when verified Skyway content and assets are available.

## Skyway media

The source video came from the GitHub release `assets-v9`:

```text
https://github.com/DKGDevelopment/Piraeus3.0/releases/tag/assets-v9
```

The release asset was an H.264 MP4 with approximately 15 seconds of video at 1668 x 1240. It was prepared for the existing `AssetVideo` source convention as follows:

| File | Purpose |
|---|---|
| `public/video/skyway.webm` | Full-size VP9 video for supported browsers |
| `public/video/skyway-sm.webm` | Smaller VP9 video for viewport widths up to 900px |
| `public/video/skyway-poster.webp` | Poster frame generated from approximately one second into the source video |

The repository `.gitignore` excludes `*.mp4`, so the generated MP4 working copies are not part of the committed implementation. The committed WebM files are the formats currently used by the browser in this repository. `components/AssetVideo.tsx` still contains MP4 fallback source entries for consistency with the Skyblue pattern; those entries will only work when corresponding MP4 files are supplied and intentionally force-added or the ignore policy is changed.

The video is referenced by passing the base name only:

```tsx
<AssetVideo
  name={building.name}
  standfirst="Residential apartments"
  src="skyway"
/>
```

`AssetVideo` resolves the media paths under `/video/` and expects the poster at `/video/skyway-poster.webp`. Do not pass a full file path as `src`.

## Existing content boundaries

`lib/buildings.ts` already contains the Skyway masterplan building record and route identity:

```text
id: skyway
name: Skyway
```

The generic non-Skyblue asset routes remain placeholders. Skyway is no longer a placeholder, but it should not be treated as a complete property sales page until its contact flow, verified project content, and any future residence/location assets are added.

The newsletter form in `components/Newsletter.tsx` is still front-end-only. It displays a thank-you state but deliberately reports that it is not connected to a mailing list. The shared enquiry and booking links still point to `/contact`, which is not implemented in this repository at the time of writing. Do not describe either flow as production-connected.

## Verification

From the repository root, use:

```bash
npm ci
npm run build
```

The Skyway implementation was verified with a successful production build and browser rendering at `/assets/skyway`. If the development server shows a stale Webpack runtime overlay after hot reload, stop and restart the server before diagnosing the page code; a clean restart resolved that issue during the original implementation.

The expected production build output includes a statically generated `/assets/skyway` route. The page should render the Skyway hero, project copy, and newsletter/footer panel without a runtime error.

## Change history

The Skyway page and media were added in commit `21a4482` with message:

```text
Add Skyway asset page from assets-v9
```

Future changes should preserve the existing Skyblue visual language and shared components unless there is a clear reason to introduce a new pattern.
