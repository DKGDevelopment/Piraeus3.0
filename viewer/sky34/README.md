# Sky34 Runnable Interactive Viewer Package

This folder contains the actual runnable source, styles, data/configuration, and visual assets for the Sky34 interactive 3D viewer. Claude Code can use this package directly instead of rebuilding the viewer from a description.

## Package contents

| File or folder | Purpose |
|---|---|
| `src/Sky34Viewer.tsx` | Complete client-side React viewer component with model loading, orbit controls, fullscreen, floor/apartment navigation, unit dossier, and request-details interaction |
| `src/Sky34Viewer.css` | Viewer layout, responsive behavior, editorial styling, controls, stage, material legend, and unit dossier styles |
| `src/viewer-data.ts` | Asset configuration, floor/apartment identifiers, unit-detail model, and building-wide material-family definitions |
| `public/assets/sky34-viewer.glb` | Browser-ready compact GLB with distinct architecture material families |
| `public/assets/skyway-reference.webp` | Supplied Skyway reference render used as the loading poster |
| `public/assets/sky34-logo.png` | S34 monogram mark |
| `public/assets/sky34-dusk-texture.jpg` | Stage texture |

## Install

The destination website needs the following dependency:

```bash
pnpm add @google/model-viewer lucide-react
```

The source is a Next.js-compatible client component. It begins with:

```tsx
"use client";
import "./Sky34Viewer.css";
import "@google/model-viewer";
```

If the destination project uses a different alias or styling pipeline, keep the component logic and move the CSS import to the appropriate global or route-level stylesheet.

## Use in the existing Next.js app

Copy `src/Sky34Viewer.tsx` and `src/Sky34Viewer.css` into the desired component directory, then import the component from a page or route:

```tsx
import Sky34Viewer from "@/components/Sky34Viewer";

export default function Sky34Page() {
  return <Sky34Viewer />;
}
```

Copy the contents of `public/assets` into the destination project’s `public/sky34-viewer/assets` directory. The source already uses these paths:

```text
/sky34-viewer/assets/sky34-viewer.glb
/sky34-viewer/assets/skyway-reference.webp
/sky34-viewer/assets/sky34-logo.png
/sky34-viewer/assets/sky34-dusk-texture.jpg
```

If the main site uses a CDN, replace the four asset paths in `src/viewer-data.ts` and the constants at the top of `src/Sky34Viewer.tsx`.

## Behavior included

The model uses `@google/model-viewer` with orbit controls, touch pan behavior, zoom, reset view, fullscreen mode, a loading poster, and a loading/ready state. The component applies a building-wide material hierarchy on the model load event so the whole residence reads with distinct warm façade/balcony surfaces, deep blue glazing and recess bands, blue pool/water, and warm lighting accents.

The floor and apartment selects are **navigation and identification controls only**. They update the camera orbit and the selected-unit labels; they do not recolour individual floors or apartments. This matches the intended client presentation and avoids creating a misleading monochrome or per-unit material treatment.

The unit dossier opens when a floor or apartment is selected. It includes a floor-plan preview area, unit title, level, aspect, area, rooms, a close button, and a request-details action. The current unverified fields intentionally read `To be confirmed`, and the preview reads `Floor plan preview · pending upload` until approved plans and a unit schedule are provided.

## Data replacement

When verified unit data is available, replace the safe placeholder function in `src/viewer-data.ts` with real values or connect it to the existing CMS/database:

```ts
export type Sky34UnitDetails = {
  apartment: string;
  floor: string;
  aspect: string;
  area: string;
  rooms: string;
  floorPlanUrl?: string;
};
```

Do not add invented area, room counts, orientation, price, availability, or status. If true apartment-level highlighting is required, export the GLB with apartment-separated meshes or reliable node metadata, then replace the camera-only selection mapping with mesh visibility/highlighting.

## Visual direction

The interface is the **Coastal Concrete Editorial** direction: a warm parchment property rail beside a blue architectural stage. The layout is asymmetric, with a serif editorial headline and compact sans-serif metadata. The model itself remains the visual hero. Keep the building-wide material hierarchy intact so windows, walls, balconies, recesses, pool, and lighting accents remain discernible from every orbit angle.

## Validation checklist

Run the destination project’s type check and production build after copying the package. Verify model loading and poster fallback, orbit/zoom/pan, reset, fullscreen, floor selection, apartment selection, dossier open/close, mobile scrolling, and the request-details acknowledgement. Check that the four assets resolve from the destination website’s public paths.
