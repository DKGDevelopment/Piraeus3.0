'use client';

import './Sky34Viewer.css';
import { useEffect, useRef, useState } from 'react';
import { Grid2x2, Heart, List, Maximize2, Mouse, RotateCcw, Ruler, SunMedium, ZoomIn } from 'lucide-react';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean;
          'camera-controls'?: boolean;
          'touch-action'?: string;
          'shadow-intensity'?: string;
          exposure?: string;
          'environment-image'?: string;
          'camera-orbit'?: string;
          'field-of-view'?: string;
          'interaction-prompt'?: string;
          loading?: string;
          poster?: string;
        };
      }
    }
  }
}

const MODEL_URL = '/sky34-viewer/assets/skyway-floors.glb';
const DUSK_TEXTURE = '/sky34-viewer/assets/sky34-dusk-texture.jpg';
const POSTER_URL = '/sky34-viewer/assets/skyway-reference.webp';

// Unlike the previous handoff, this GLB's floors are real separate nodes
// (Layer:1, Layer:3 … Layer:10 — the architects' export has no Layer:2) each
// with its own material, so floors can be addressed directly instead of via
// a calibrated screenshot hack. Both the hotspot position and the material
// index below were read straight from the file's node transforms and
// mesh/material indices (each floor layer maps 1:1 to a material slot).
const FLOOR_MATERIAL_INDEX: Record<string, number> = {
  '1': 12,
  '3': 1,
  '4': 2,
  '5': 3,
  '6': 4,
  '7': 8,
  '8': 7,
  '9': 6,
  '10': 5,
};

// One point per floor at the top-front edge of its slab, computed from the
// node's own bounding box and transform (bbox center in X/Y, max Z for the
// front-top edge) rather than marked up by hand.
const FLOOR_HOTSPOTS: { floor: string; position: string }[] = [
  { floor: '1', position: '-1.831 7.560 -0.779' },
  { floor: '3', position: '-0.863 13.160 0.216' },
  { floor: '4', position: '-1.807 15.960 0.216' },
  { floor: '5', position: '-1.807 18.760 0.216' },
  { floor: '6', position: '-6.497 21.560 2.305' },
  { floor: '7', position: '-6.497 24.360 2.305' },
  { floor: '8', position: '-1.823 27.160 5.025' },
  { floor: '9', position: '-1.823 29.960 5.025' },
  { floor: '10', position: '-1.823 32.760 5.025' },
];

const WINDOWS_MATERIAL_INDEX = 22;
const WATER_MATERIAL_INDEX = 26;
const GREEN_MATERIAL_INDICES = new Set([9, 10]);
const ROAD_MATERIAL_INDEX = 25;

const FACADE_COLOR: [number, number, number, number] = [0.62, 0.53, 0.4, 1];
const FLOOR_DIM_COLOR: [number, number, number, number] = [0.32, 0.29, 0.25, 1];
const FLOOR_HIGHLIGHT_COLOR: [number, number, number, number] = [0.92, 0.32, 0.06, 1];

/**
 * The Sky34 interactive 3D viewer, built by Manus and handed off as a
 * standalone Next.js-compatible client component (see
 * docs/CLAUDE_3D_VIEWER_HANDOFF.md and viewer/sky34/README.md for the
 * original spec). Ported in with minimal changes: the CSS is scoped to
 * .viewer-shell instead of :root/body so it can't leak onto the rest of
 * the site, and its two fonts are self-hosted through next/font instead
 * of relying on a global @import.
 */
export default function Sky34Viewer() {
  // Coastal Concrete Editorial reminder: asymmetrical rail + expansive stage, mineral surfaces,
  // instrument-like controls, and a calm, non-looping interaction language.
  const viewerRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState('1');
  const [selectedApartment, setSelectedApartment] = useState('Apartment 01');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const materialsRef = useRef<any[]>([]);

  // Unit codes follow floor-number + two-digit position (e.g. floor 5's
  // second unit is "502") — a systematic placeholder, not real unit
  // numbering, until an approved schedule exists.
  const floorNum = Number(selectedFloor);
  const floorUnits = [1, 2, 3, 4].map((i) => ({
    code: `${floorNum}${String(i).padStart(2, '0')}`,
    apartment: `Apartment ${String(i).padStart(2, '0')}`,
  }));

  // The custom element touches browser globals as soon as its module
  // evaluates, which breaks static prerendering if imported at module scope
  // — load it only once mounted in the browser.
  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current as any;
    if (!viewer) return;
    const onLoad = () => {
      setLoaded(true);
      const materials = viewer.model?.materials ?? [];
      materialsRef.current = materials;
      // Unlike the previous model, this GLB carries no material names (every
      // slot is an unlabelled CAD "fallback Material"), so roles are matched
      // by index instead — read directly from the file's own mesh/material
      // list rather than guessed from a name. Floor materials start at the
      // facade tone here; the effect below recolours them per selection.
      materials.forEach((material: any, index: number) => {
        const pbr = material.pbrMetallicRoughness;
        if (!pbr) return;
        const isGlazing = index === WINDOWS_MATERIAL_INDEX;
        const isWater = index === WATER_MATERIAL_INDEX;
        const isGreen = GREEN_MATERIAL_INDICES.has(index);
        const isRoad = index === ROAD_MATERIAL_INDEX;
        const color: [number, number, number, number] = isGlazing
          ? [0.035, 0.18, 0.42, 1]
          : isWater
            ? [0.02, 0.32, 0.34, 1]
            : isGreen
              ? [0.22, 0.34, 0.19, 1]
              : isRoad
                ? [0.34, 0.34, 0.34, 1]
                : FACADE_COLOR;
        pbr.setBaseColorFactor(color);
        pbr.setMetallicFactor(isGlazing ? 0.28 : 0.02);
        pbr.setRoughnessFactor(isGlazing ? 0.12 : 0.56);
      });
    };
    viewer.addEventListener('load', onLoad);
    return () => viewer.removeEventListener('load', onLoad);
  }, []);

  // Highlights the selected floor's slab and dims the rest, so the tower
  // stays fully visible rather than isolating one level in a cutaway.
  useEffect(() => {
    if (!loaded) return;
    const materials = materialsRef.current;
    for (const [floor, index] of Object.entries(FLOOR_MATERIAL_INDEX)) {
      const pbr = materials[index]?.pbrMetallicRoughness;
      if (!pbr) continue;
      pbr.setBaseColorFactor(floor === selectedFloor ? FLOOR_HIGHLIGHT_COLOR : FLOOR_DIM_COLOR);
    }
  }, [selectedFloor, loaded]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const floorIndex = Number(selectedFloor);
    const apartmentIndex = Number(selectedApartment.slice(-2)) || 1;
    const elevation = Math.max(38, 74 - floorIndex * 3.2);
    const azimuth = 22 + apartmentIndex * 8;
    viewer.setAttribute('camera-orbit', `${azimuth}deg ${elevation}deg auto`);
  }, [selectedFloor, selectedApartment]);

  const resetView = () => {
    const viewer = viewerRef.current as
      | (HTMLElement & { resetTurntableRotation?: () => void; jumpCameraToGoal?: () => void })
      | null;
    viewer?.resetTurntableRotation?.();
    viewer?.setAttribute('camera-orbit', '35deg 68deg auto');
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

  useEffect(() => {
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  return (
    <main className="viewer-shell">
      <aside className="project-rail">
        <div className="rail-topline">
          <span className="eyebrow">Private viewing room</span>
          <span className="status-dot" />
        </div>
        <div className="brand-lockup">
          <span className="brand-wordmark">SKYWAY</span>
        </div>
        <div className="vertical-stamp">SKYWAY / ATHENS</div>
        <section className="project-intro">
          <p className="kicker">Residence 01 · 2026 · Skyway palette</p>
          <h1>
            Orbit the residence.
            <br />
            <em>Read the silhouette.</em>
          </h1>
          <p className="lede">An interactive study of the terraces, glazing, and planted edges that define Skyway.</p>
        </section>

        <div className="rail-rule" />

        <section className="results-panel" aria-label="Units on the selected floor">
          <div className="results-panel__header">
            <div className="results-panel__title">
              <span>{floorUnits.length} results</span>
              <span className="selection-count">Floor {selectedFloor}</span>
            </div>
            <div className="results-panel__tools">
              <span className="results-sort">
                Name: A-Z <span className="results-sort__chevron">⌄</span>
              </span>
              <span className="results-view">
                <List size={14} />
                <Grid2x2 size={14} />
              </span>
            </div>
          </div>

          <ul className="results-list">
            {floorUnits.map((unit) => (
              <li className="result-card" key={unit.code}>
                <div className="result-card__info">
                  <div className="result-card__top">
                    <span className="result-card__code">{unit.code}</span>
                    <span className="result-card__status">To be confirmed</span>
                  </div>
                  <div className="result-card__stat">
                    <span>Area</span>
                    <strong>To be confirmed</strong>
                  </div>
                  <div className="result-card__stat">
                    <span>Rooms</span>
                    <strong>To be confirmed</strong>
                  </div>
                  <div className="result-card__stat">
                    <span>Floor</span>
                    <strong>{selectedFloor}</strong>
                  </div>
                </div>
                <div className="result-card__plan" role="img" aria-label="Floor plan preview pending upload">
                  <div className="plan-grid" />
                  <div className="plan-outline">
                    <span className="plan-door" />
                  </div>
                  <button
                    type="button"
                    className={`result-card__fav${favorites.has(unit.code) ? ' is-active' : ''}`}
                    aria-label={favorites.has(unit.code) ? 'Remove from saved units' : 'Save unit'}
                    aria-pressed={favorites.has(unit.code)}
                    onClick={() =>
                      setFavorites((current) => {
                        const next = new Set(current);
                        next.has(unit.code) ? next.delete(unit.code) : next.add(unit.code);
                        return next;
                      })
                    }
                  >
                    <Heart size={14} fill={favorites.has(unit.code) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="reference-legend" aria-label="Building-wide material legend">
            <span>
              <i className="legend-swatch facade" />
              Walls / balconies
            </span>
            <span>
              <i className="legend-swatch glazing" />
              Blue glazing
            </span>
            <span>
              <i className="legend-swatch pool" />
              Pool / water
            </span>
          </div>
        </section>

        <section className="details-block" aria-label="Project details">
          <div className="detail-row">
            <span>Project</span>
            <strong>Skyway</strong>
          </div>
          <div className="detail-row">
            <span>Typology</span>
            <strong>Urban residence</strong>
          </div>
          <div className="detail-row">
            <span>View</span>
            <strong>Exterior / hero</strong>
          </div>
          <div className="detail-row">
            <span>Drawing set</span>
            <strong>A-01 / 04</strong>
          </div>
          <div className="detail-row">
            <span>Selected</span>
            <strong>
              {selectedFloor} · {selectedApartment.replace('Apartment ', 'A-')}
            </strong>
          </div>
        </section>

        <div className="rail-bottom">
          <p className="micro-note">
            Use your cursor to orbit.
            <br />
            Scroll to move through the volume.
          </p>
          <button className="help-button" onClick={() => setHelpOpen((value) => !value)} aria-expanded={helpOpen}>
            <span className="help-index">01</span>
            <span>How to explore</span>
            <span className="help-plus">{helpOpen ? '−' : '+'}</span>
          </button>
          {helpOpen && <div className="help-panel">Drag to orbit · Shift + drag to pan · Scroll or pinch to zoom.</div>}
        </div>
      </aside>

      <section className="viewer-stage" ref={stageRef} aria-label="Interactive 3D model viewer">
        <div className="stage-texture" style={{ backgroundImage: `url(${DUSK_TEXTURE})` }} />
        <div className="stage-grid" />
        <header className="stage-header">
          <div>
            <span className="stage-label">Live model</span>
            <span className="stage-divider" />
            <span className="stage-location">Athens · GR</span>
          </div>
          <div className="stage-top-right">
            <span className={loaded ? 'load-state loaded' : 'load-state'}>
              <span className="load-dot" />
              {loaded ? 'Model ready' : 'Loading model'}
            </span>
            <button className="icon-button" onClick={enterFullscreen} aria-label="Toggle fullscreen">
              <Maximize2 size={16} />
            </button>
          </div>
        </header>

        <div className="model-wrap">
          <model-viewer
            ref={viewerRef as React.RefObject<HTMLElement>}
            src={MODEL_URL}
            alt="Interactive 3D model of the Skyway residence"
            camera-controls
            touch-action="pan-y"
            shadow-intensity="1.15"
            exposure="0.68"
            environment-image="neutral"
            camera-orbit="35deg 68deg auto"
            field-of-view="35deg"
            interaction-prompt="auto"
            loading="eager"
            poster={POSTER_URL}
          >
            {FLOOR_HOTSPOTS.map(({ floor, position }) => (
              <button
                key={floor}
                type="button"
                slot={`hotspot-floor-${floor}`}
                className={`floor-hotspot${floor === selectedFloor ? ' is-active' : ''}`}
                data-position={position}
                data-normal="0 0 1"
                aria-label={`Floor ${floor}`}
                onClick={() => setSelectedFloor(floor)}
              >
                <span className="floor-hotspot__ring" />
              </button>
            ))}
          </model-viewer>
          {!loaded && (
            <div className="model-loading">
              <span className="loading-ring" />
              <span>Preparing the residence</span>
            </div>
          )}
        </div>

        <div className="selection-callout" aria-live="polite">
          <span className="callout-line" />
          <div>
            <span className="callout-label">Selected level</span>
            <strong>
              Floor {selectedFloor} · {selectedApartment.replace('Apartment ', 'A-')}
            </strong>
          </div>
          <i className="callout-color" />
        </div>

        <div className="stage-controls">
          <div className="control-cluster">
            <button className="control-button" onClick={resetView}>
              <RotateCcw size={15} />
              <span>Reset view</span>
            </button>
            <button className="control-button" onClick={enterFullscreen}>
              <Maximize2 size={15} />
              <span>{fullscreen ? 'Exit full view' : 'Full view'}</span>
            </button>
          </div>
          <div className="interaction-legend">
            <span>
              <Mouse size={14} />
              Orbit
            </span>
            <span>
              <ZoomIn size={14} />
              Zoom
            </span>
            <span>
              <Ruler size={14} />
              Pan
            </span>
          </div>
        </div>

        <div className="material-strip" aria-label="Model palette">
          <span className="material-label">
            <SunMedium size={14} /> Building-wide material study
          </span>
          <span className="material-chip">
            <i className="swatch swatch-limestone" />
            Limestone
          </span>
          <span className="material-chip">
            <i className="swatch swatch-glass" />
            Sea-glass
          </span>
          <span className="material-chip">
            <i className="swatch swatch-concrete" />
            Concrete
          </span>
          <span className="material-chip">
            <i className="swatch swatch-terra" />
            Terracotta
          </span>
        </div>

        <div className="coordinate coordinate-tl">N 37° 58′ 12″</div>
        <div className="coordinate coordinate-br">A-01 / 04</div>
      </section>
    </main>
  );
}
