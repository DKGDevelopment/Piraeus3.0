# Sky34 Interactive 3D Viewer — Claude Code Handoff

## Purpose

Reproduce the current Sky34 interactive architectural viewer on the main website. The experience is a client-facing property presentation built around a browser-loaded GLB model. Users can orbit, pan, zoom, reset, enter fullscreen, select a floor, select an apartment identifier, inspect a unit dossier, and request further unit details.

The viewer is intentionally **building-wide and material-led**. Walls, balcony slabs, recessed bands, glazing, pool/water, and lighting must remain visually discernible across the full building. Floor and apartment selectors are navigation and identification controls; they must not recolour individual floors or apartments.

## Current source of truth in this repository

| Concern | File |
|---|---|
| Main viewer page | `client/src/pages/Home.tsx` |
| Global styling and responsive layout | `client/src/index.css` |
| Document title and font loading | `client/index.html` |
| Design decisions | `ideas.md` |
| Project checklist | `todo.md` |
| This handoff | `CLAUDE_3D_VIEWER_HANDOFF.md` |

The current app uses React, Vite, TypeScript, `@google/model-viewer`, and `lucide-react`.

## Required dependency

```bash
pnpm add @google/model-viewer lucide-react
```

The 3D runtime is loaded in the page component:

```tsx
import "@google/model-viewer";
```

For React + TypeScript, add a JSX declaration for the custom element or create a local declaration file:

```tsx
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean;
          "touch-action"?: string;
          "shadow-intensity"?: string;
          exposure?: string;
          "environment-image"?: string;
          "camera-orbit"?: string;
          "field-of-view"?: string;
          "interaction-prompt"?: string;
          loading?: string;
          poster?: string;
        };
      }
    }
  }
}
```

## Asset manifest

These are the current managed asset paths used by the viewer. If the main website cannot resolve Manus storage paths, copy the assets to the website’s own static/CDN storage and replace the values in one central asset configuration object.

| Asset | Current path | Use |
|---|---|---|
| Browser-ready GLB | `/manus-storage/sky34-viewer_d2e11758.glb` | Compact building-focused model with material separation |
| Reference render poster | `/manus-storage/skyway-reference_74596c6f.webp` | Loading/poster image based on the supplied Skyway render |
| Dusk/blue stage texture | `/manus-storage/sky34-dusk-texture_18311e23.jpg` | Subtle stage texture behind the model |
| S34 monogram | `/manus-storage/sky34-logo_49e847f6.png` | Brand mark in the rail |

The current local staging files were generated from the supplied assets. The GLB is the cleaned export, not the original oversized site file. It retains the residence, terraces, glazing, pool, and core architecture while removing distant entourage and oversized site/map geometry that made browser framing difficult.

Centralise asset references in the destination project:

```ts
export const SKY34_ASSETS = {
  model: "/assets/sky34-viewer.glb",
  poster: "/assets/skyway-reference.webp",
  stageTexture: "/assets/sky34-dusk-texture.jpg",
  logo: "/assets/sky34-logo.png",
} as const;
```

## Core viewer component pattern

The essential model element is:

```tsx
<model-viewer
  ref={viewerRef as React.RefObject<HTMLElement>}
  src={SKY34_ASSETS.model}
  alt="Interactive 3D model of the Sky34 residence"
  camera-controls
  touch-action="pan-y"
  shadow-intensity="1.15"
  exposure="0.68"
  environment-image="neutral"
  camera-orbit="35deg 68deg auto"
  field-of-view="35deg"
  interaction-prompt="auto"
  loading="eager"
  poster={SKY34_ASSETS.poster}
/>
```

Recommended controls:

```tsx
const resetView = () => {
  const viewer = viewerRef.current as (HTMLElement & {
    resetTurntableRotation?: () => void;
    jumpCameraToGoal?: () => void;
  }) | null;

  viewer?.resetTurntableRotation?.();
  viewer?.setAttribute("camera-orbit", "35deg 68deg auto");
  viewer?.jumpCameraToGoal?.();
};

const enterFullscreen = async () => {
  if (!stageRef.current) return;
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    setFullscreen(false);
  } else {
    await stageRef.current.requestFullscreen?.();
    setFullscreen(true);
  }
};
```

Listen for model readiness and access materials through the loaded model:

```tsx
useEffect(() => {
  const viewer = viewerRef.current as any;
  if (!viewer) return;

  const onLoad = () => {
    setLoaded(true);
    const materials = viewer.model?.materials ?? [];

    materials.forEach((material: any) => {
      const name = String(material.name || "").toUpperCase();
      const pbr = material.pbrMetallicRoughness;
      if (!pbr) return;

      const color = name.includes("GLASS")
        ? [0.035, 0.18, 0.42, 1]
        : name.includes("POOL")
          ? [0.01, 0.26, 0.5, 1]
          : name.includes("LIGHT")
            ? [0.92, 0.32, 0.06, 1]
            : name.includes("WARM WHITE FACADE")
              ? [0.23, 0.15, 0.085, 1]
              : [0.12, 0.09, 0.07, 1];

      pbr.setBaseColorFactor(color);
      pbr.setMetallicFactor(name.includes("GLASS") ? 0.28 : 0.02);
      pbr.setRoughnessFactor(name.includes("GLASS") ? 0.12 : 0.56);
    });
  };

  viewer.addEventListener("load", onLoad);
  return () => viewer.removeEventListener("load", onLoad);
}, []);
```

## Material hierarchy

The intended building-wide visual hierarchy is:

| Material family | Appearance | Purpose |
|---|---|---|
| `WARM WHITE FACADE` | Warm sand/limestone | Main façade planes and architectural walls |
| `GLASS` | Deep reflective blue | Windows and balcony glazing |
| Neutral fallback | Dark warm concrete | Recesses, undersides, balcony shadow bands, secondary masses |
| `POOL` | Saturated blue | Pool and water elements |
| `LIGHT` | Warm terracotta/orange | Architectural lighting accents |

Do **not** set every material to the same fallback color. Do **not** apply selected apartment or floor colors to the whole model. The model should read as one coherent building with clearly separated architectural material families.

## Floor and apartment selection model

The current UI uses safe presentation identifiers because no approved unit schedule has been supplied yet:

```ts
const floors = ["Ground", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
const apartments = ["Apartment 01", "Apartment 02", "Apartment 03", "Apartment 04"];
```

State:

```tsx
const [selectedFloor, setSelectedFloor] = useState("Ground");
const [selectedApartment, setSelectedApartment] = useState("Apartment 01");
```

Selection changes should update camera position and identification labels only:

```tsx
useEffect(() => {
  const viewer = viewerRef.current;
  if (!viewer) return;

  const floorIndex = selectedFloor === "Ground" ? 0 : Number(selectedFloor);
  const apartmentIndex = Number(selectedApartment.slice(-2)) || 1;
  const elevation = Math.max(38, 74 - floorIndex * 3.2);
  const azimuth = 22 + apartmentIndex * 8;

  viewer.setAttribute("camera-orbit", `${azimuth}deg ${elevation}deg auto`);
}, [selectedFloor, selectedApartment]);
```

This is a presentational navigation mapping. It is not a claim about apartment availability, orientation, area, price, or status. When the GLB is later exported with separate apartment meshes, replace this with true mesh selection and highlighting while preserving the same state interface.

## Unit dossier panel

The selected-unit panel is an overlay drawer on desktop and a scrollable panel on mobile. It opens automatically when a floor or apartment is selected. Its current fields are intentionally marked pending:

```ts
type UnitDossier = {
  apartment: string;
  floor: string;
  aspect: string;
  area: string;
  rooms: string;
  floorPlanUrl?: string;
};

const selectedUnit: UnitDossier = {
  apartment: selectedApartment,
  floor: selectedFloor === "Ground" ? "Ground floor" : `Floor ${selectedFloor}`,
  aspect: "To be confirmed",
  area: "To be confirmed",
  rooms: "To be confirmed",
};
```

Until approved floor plans and a unit schedule are supplied, show a labelled floor-plan placeholder such as `Floor plan preview · pending upload`. Do not invent dimensions, room counts, prices, availability, or orientation.

The panel should include:

| Element | Behavior |
|---|---|
| Unit title | Reflects selected apartment identifier |
| Floor-plan preview | Uses the approved uploaded plan when available; otherwise shows pending placeholder |
| Level | Reflects selected floor |
| Aspect, area, rooms | Verified values only; otherwise `To be confirmed` |
| Close button | Hides the panel without changing selection |
| Request unit details | Local acknowledgement now; connect to CRM/enquiry form later |

## Visual direction

The chosen style is **Coastal Concrete Editorial**: a warm parchment rail paired with an expansive blue architectural stage. The layout is asymmetrical rather than a centered dashboard. Use a serif display face for the editorial headline and a clean sans-serif for metadata and controls. The current implementation uses `DM Serif Display` for display text and `Manrope` for interface text.

Core colors:

```css
:root {
  --ink: #0e1a20;
  --limestone: #f0e9de;
  --sea-glass: #9dbdb5;
  --stage-blue: #7fa5c7;
  --deep-blue: #174a78;
  --terracotta: #c86f4a;
}
```

The visual hierarchy should preserve a warm editorial dossier on the left and an immersive model stage on the right. Keep controls restrained, rectangular or lightly rounded, with visible focus states. Respect `prefers-reduced-motion`.

## Recommended destination integration steps

1. Copy the four assets into the main website’s managed static or CDN storage and update the central asset configuration.
2. Install `@google/model-viewer` and the existing icon package, or map the icons to the destination site’s icon system.
3. Port the model viewer component and its load-time material mapping.
4. Port the floor/apartment state and camera-navigation effect.
5. Port the unit dossier panel, retaining pending-data labels until approved plans and unit schedules are available.
6. Port the key CSS tokens and responsive layout, adapting only the outer site shell and brand typography.
7. Verify desktop and mobile behavior, including orbit, zoom, pan, reset, fullscreen, panel close, select changes, and poster loading.
8. If true per-apartment highlighting is required, create a new GLB export with apartment-level meshes or node metadata. Do not simulate apartment geometry by recolouring the full model.

## Acceptance criteria

The reproduction is complete when the browser loads the Sky34 GLB with a poster fallback; walls, balcony slabs, recesses, windows, and pool remain discernible; orbit, zoom, pan, reset, and fullscreen work; floor and apartment selectors update camera framing and labels without recolouring the model; the unit dossier opens and closes responsively; unverified unit data is clearly marked; and the build passes the destination project’s type check and production build.
